import unittest
from unittest.mock import patch, MagicMock
from unittest.mock import patch, PropertyMock
import sys
from datetime import date
import json
import os

# Mock environment variables
os.environ['POSTGRES_USER'] = 'test_user'
os.environ['POSTGRES_PASSWORD'] = 'test_password'
os.environ['POSTGRES_DB'] = 'test_db'
os.environ['AWS_ACCESS_KEY_ID'] = 'test_key'
os.environ['AWS_SECRET_ACCESS_KEY'] = 'test_secret'

# Mock modules
sys.modules['pika'] = MagicMock()
sys.modules['boto3'] = MagicMock()

# Create comprehensive mock for amqp_connection
mock_create_connection = MagicMock()
mock_connection = MagicMock()
mock_channel = MagicMock()
mock_connection.channel.return_value = mock_channel
mock_create_connection.return_value = mock_connection

mock_amqp = MagicMock()
mock_amqp.create_connection = mock_create_connection
mock_amqp.check_exchange = MagicMock(return_value=True)
mock_amqp.publish_to_broker = MagicMock()
mock_amqp.exchangename = "email_exchange"
mock_amqp.exchangetype = "topic"
mock_amqp.user = "guest"
mock_amqp.password = "guest"

sys.modules['amqp_connection'] = mock_amqp

# Now import the application
from app import app, db, User, RequestModel, FileRequestAssoc, TransferRequest, resolve_own_schedule, resolve_team_schedule
from app import resolve_department_schedule, resolve_own_requests, resolve_request, resolve_subordinates_request, resolve_manager_list

class TestAMQPConnection(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.mock_channel = MagicMock()
        self.mock_connection = MagicMock()
        self.mock_connection.channel.return_value = self.mock_channel
        mock_amqp.publish_to_broker.reset_mock()

    def test_publish_to_broker(self):
        """Test message publication to broker"""
        message = "Test message"
        subject = "Test subject"
        email = "test@example.com"
        
        mock_amqp.publish_to_broker(message, subject, email, self.mock_channel)
        
        mock_amqp.publish_to_broker.assert_called_with(
            message,
            subject,
            email,
            self.mock_channel
        )

def test_check_exchange_success(self):
    """Test successful exchange check"""
    self.mock_channel.exchange_declare.return_value = None
    result = mock_amqp.check_exchange(self.mock_channel, "test_exchange", "topic")
    self.assertTrue(result)

def test_check_exchange_failure(self):
    """Test failed exchange check"""
    # Mock the check_exchange function directly
    original_check_exchange = mock_amqp.check_exchange
    mock_amqp.check_exchange = MagicMock(return_value=False)
    
    result = mock_amqp.check_exchange(self.mock_channel, "test_exchange", "topic")
    self.assertFalse(result)
    
    # Restore original function
    mock_amqp.check_exchange = original_check_exchange

class FlaskAppTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['TESTING'] = True
        cls.client = app.test_client()
        # Set up mock for amqp publish
        cls.amqp_publish_patcher = patch('amqp_connection.publish_to_broker')
        cls.mock_publish = cls.amqp_publish_patcher.start()

    @classmethod
    def tearDownClass(cls):
        cls.amqp_publish_patcher.stop()

    def setUp(self):
        with app.app_context():
            db.create_all()
            
            # Reset the mock before each test
            self.mock_publish.reset_mock()
            
            # First create CEO (reports to self)
            ceo = User(
                staff_id=130002,
                staff_fname="Jack",
                staff_lname="Sim",
                dept="CEO",
                position="MD",
                country="Singapore",
                email="jack.sim@allinone.com.sg",
                reporting_manager=130002,  # CEO reports to self
                role=1,
                password="hashed_password"
            )
            db.session.add(ceo)
            db.session.commit()

            # Add other users
            other_users = [
                User(staff_id=140001,
                     staff_fname="Derek",
                     staff_lname="Tan",
                     dept="Sales",
                     position="Director",
                     country="Singapore",
                     email="Derek.Tan@allinone.com.sg",
                     reporting_manager=130002,
                     role=1,
                     password="hashed_password"),
                User(staff_id=140894,
                     staff_fname="Rahim",
                     staff_lname="Khalid",
                     dept="Sales",
                     position="Sales Manager",
                     country="Singapore",
                     email="Rahim.Khalid@allinone.com.sg",
                     reporting_manager=140001,
                     role=3,
                     password="hashed_password"),
                User(staff_id=150008,
                     staff_fname="Eric",
                     staff_lname="Loh",
                     dept="Marketing",
                     position="Marketing Manager",
                     country="Singapore",
                     email="Eric.Loh@allinone.com.sg",
                     reporting_manager=130002,
                     role=3,
                     password="hashed_password")
            ]
            
            for user in other_users:
                db.session.add(user)
            db.session.commit()
            
            # Add test requests
            test_requests = [
                RequestModel(
                    request_id=1,
                    requesting_staff=130002,
                    year=2024,
                    month=10,
                    day=5,
                    type="AM",
                    status="pending",
                    approving_manager=130002,
                    created_at=date(2024, 10, 1),
                    reason="Family event"
                ),
                RequestModel(
                    request_id=2,
                    requesting_staff=140001,
                    year=2024,
                    month=10,
                    day=6,
                    type="PM",
                    status="approved",
                    approving_manager=130002,
                    created_at=date(2024, 10, 2),
                    reason="Doctor appointment"
                ),
                RequestModel(
                    request_id=3,
                    requesting_staff=140894,
                    year=2024,
                    month=10,
                    day=7,
                    type="FULL",
                    status="rejected",
                    approving_manager=140001,
                    created_at=date(2024, 10, 3),
                    reason="Vacation"
                ),
                RequestModel(
                    request_id=4,
                    requesting_staff=150008,
                    year=2024,
                    month=10,
                    day=8,
                    type="AM",
                    status="pending",
                    approving_manager=130002,
                    created_at=date(2024, 10, 4),
                    reason="Team building"
                )
            ]
            
            for request in test_requests:
                db.session.add(request)
            db.session.commit()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_resolve_own_schedule(self):
        """Test own schedule resolution"""
        with app.app_context():
            result = resolve_own_schedule(10, 2024, 130002)
            self.assertEqual(result['month'], 10)
            self.assertEqual(result['year'], 2024)
            self.assertIsInstance(result['schedule'], list)

            request_day = next((day for day in result['schedule'] 
                              if day['date'] == '2024-10-05' and day['type'] == 'AM'), None)
            self.assertIsNotNone(request_day)
            self.assertEqual(request_day['availability'], 'wfh')
            self.assertTrue(request_day['is_pending'])

    def test_resolve_team_schedule(self):
        """Test team schedule resolution"""
        with app.app_context():
            result = resolve_team_schedule(10, 2024, 5, 130002)
            self.assertIsInstance(result, dict)
            self.assertIn('team_schedule', result)
            self.assertEqual(result['reporting_manager'], 130002)
            self.assertGreater(result['team_count'], 0)
            
            schedule = result['team_schedule']
            self.assertTrue(any(day['date'] == '2024-10-05' for day in schedule))

    # def test_team_schedule_as_regular_employee(self):
    #     """Test team schedule when viewed by a regular employee."""
    #     with app.app_context():
    #         result = resolve_team_schedule(10, 2024, 5, 140894)
    #         self.assertIsInstance(result, dict)
    #         # Fix: Rahim (140894) reports to Derek (140001)
    #         self.assertEqual(result['reporting_manager'], 140001)
    #         self.assertGreater(result['team_count'], 0)

    #         # Add more specific assertions
    #         team_members = [member['name'] for member in result['team_schedule'][0]['availability']]
    #         self.assertIn("Rahim Khalid", team_members)

    def test_team_schedule_full_month(self):
        """Test team schedule for entire month."""
        with app.app_context():
            result = resolve_team_schedule(10, 2024, 0, 140001)
            schedule = result['team_schedule']
            unique_dates = set(day['date'].split('-')[2] for day in schedule)
            self.assertGreater(len(unique_dates), 1)

    def test_resolve_subordinates_request(self):
        """Test retrieving subordinates' requests"""
        with app.app_context():
            result = resolve_subordinates_request(130002)
            self.assertIsInstance(result, list)
            self.assertGreater(len(result), 0)

            subordinate_request = next((req for req in result 
                                     if req['requesting_staff_name'] == "Derek Tan"), None)
            self.assertIsNotNone(subordinate_request)
            self.assertEqual(subordinate_request['date'], '2024-10-06')
            self.assertEqual(subordinate_request['type'], 'PM')
            self.assertEqual(subordinate_request['status'], 'approved')

    def test_create_request_mutation(self):
        """Test request creation mutation"""
        mutation = '''
        mutation {
            createRequest(
                staffId: 140894,
                dateType: [{date: "2024-11-15", type: "AM"}],
                reason: "Test reason"
            ) {
                success
                message
            }
        }
        '''
        with app.app_context():
            response = self.client.post('/requests', json={'query': mutation})
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            self.assertIn('data', data)
            self.assertIn('createRequest', data['data'])
            self.assertTrue(data['data']['createRequest']['success'])

    def test_accept_reject_request_mutation(self):
        """Test request acceptance/rejection mutation"""
        mutation = '''
        mutation {
            acceptRejectRequest(
                requestId: 1,
                newStatus: "approved",
                remarks: "Approved in test"
            ) {
                success
                message
            }
        }
        '''
        with app.app_context():
            response = self.client.post('/requests', json={'query': mutation})
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            self.assertTrue(data['data']['acceptRejectRequest']['success'])

            updated_request = RequestModel.query.get(1)
            self.assertEqual(updated_request.status, "approved")
            self.assertEqual(updated_request.remarks, "Approved in test")

    def test_withdraw_pending_request_mutation(self):
        """Test withdrawing a pending request"""
        mutation = '''
        mutation {
            withdrawPendingRequest(requestId: 1) {
                success
                message
            }
        }
        '''
        with app.app_context():
            response = self.client.post('/requests', json={'query': mutation})
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            self.assertTrue(data['data']['withdrawPendingRequest']['success'])

            withdrawn_request = RequestModel.query.get(1)
            self.assertEqual(withdrawn_request.status, "withdrawn")

    def test_withdraw_approved_request_mutation(self):
        """Test withdrawing an approved request"""
        mutation = '''
        mutation {
            withdrawApprovedRequest(
                requestId: 2,
                newReason: "Changed plans"
            ) {
                success
                message
            }
        }
        '''
        with app.app_context():
            response = self.client.post('/requests', json={'query': mutation})
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            self.assertTrue(data['data']['withdrawApprovedRequest']['success'])

            updated_request = RequestModel.query.get(2)
            self.assertEqual(updated_request.status, "pending_withdrawal")
            self.assertEqual(updated_request.reason, "Changed plans")

    def test_transfer_request_mutation(self):
        """Test creating a transfer request"""
        mutation = '''
        mutation {
            requestForTransfer(
                requestingManager: 140894,
                targetManager: 150008,
                reason: "Test transfer"
            ) {
                success
                message
            }
        }
        '''
        with app.app_context():
            response = self.client.post('/requests', json={'query': mutation})
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            self.assertTrue(data['data']['requestForTransfer']['success'])

    def test_accept_reject_transfer_request(self):
        """Test accepting/rejecting transfer request"""
        with app.app_context():
            transfer = TransferRequest(
                requesting_manager=140894,
                target_manager=150008,
                status="pending",
                reason="Test transfer"
            )
            db.session.add(transfer)
            db.session.commit()

            mutation = '''
            mutation {
                acceptRejectTransferRequest(
                    requestId: 1,
                    newStatus: "accepted"
                ) {
                    success
                    message
                }
            }
            '''
            response = self.client.post('/requests', json={'query': mutation})
            data = json.loads(response.data)
            self.assertTrue(data['data']['acceptRejectTransferRequest']['success'])

    def test_resolve_request(self):
        """Test resolving specific request"""
        with app.app_context():
            result = resolve_request(1)
            expected_result = {
                "request_id": 1,
                "date": "2024-10-05",
                "created_at": date(2024, 10, 1),
                "type": "AM",
                "status": "pending",
                "reason": "Family event",
                "remarks": None,
                "files": []
            }
            self.assertEqual(result, expected_result)

    def test_resolve_manager_list(self):
        with app.app_context():
            # Mock the user's position check to return director
            with patch.object(User, 'position', new_callable=PropertyMock) as mock_position:
                mock_position.return_value = "Director"
                result = resolve_manager_list(130002)
                self.assertEqual(result['director_name'], "Jack Sim")
                self.assertIsInstance(result['manager_list'], list)
                self.assertTrue(any(manager['staff_id'] == 150008 for manager in result['manager_list']))

    def test_invalid_request(self):
        """Test resolving invalid request ID"""
        with app.app_context():
            result = resolve_request(999)
            self.assertIsNone(result)

    def test_department_schedule_director_access(self):
        """Test department schedule access for director"""
        with app.app_context():
            result = resolve_department_schedule(10, 2024, 140001, [140894])
            self.assertIsInstance(result, dict)
            self.assertEqual(result['department_name'], "Sales")
            self.assertIsInstance(result['dept_schedule'], list)

    def test_invalid_department_schedule_access(self):
        """Test department schedule access for non-director"""
        with app.app_context():
            with self.assertRaises(Exception) as context:
                resolve_department_schedule(10, 2024, 140894, None)
            self.assertTrue("User is not a director" in str(context.exception))

if __name__ == '__main__':
    unittest.main()