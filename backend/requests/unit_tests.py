import unittest
from unittest.mock import patch, MagicMock, PropertyMock, ANY
import sys
from datetime import date
import json
import os
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool

# Set environment variables
os.environ.setdefault('POSTGRES_USER', 'test_user')
os.environ.setdefault('POSTGRES_PASSWORD', 'test_password')
os.environ.setdefault('POSTGRES_DB', 'test_db')
os.environ.setdefault('AWS_ACCESS_KEY_ID', 'test_key')
os.environ.setdefault('AWS_SECRET_ACCESS_KEY', 'test_secret')

# Mock the entire amqp_connection module first
mock_amqp = MagicMock()
mock_channel = MagicMock()
mock_connection = MagicMock()
mock_connection.channel.return_value = mock_channel

# Set up the mock functions
def mock_create_connection(*args, **kwargs):
    return mock_connection

def mock_check_exchange(*args, **kwargs):
    return True

def mock_publish_to_broker(*args, **kwargs):
    pass

# Configure the mock module
mock_amqp.create_connection = mock_create_connection
mock_amqp.check_exchange = mock_check_exchange
mock_amqp.publish_to_broker = mock_publish_to_broker
mock_amqp.exchangename = "email_exchange"
mock_amqp.exchangetype = "topic"
mock_amqp.user = "guest"
mock_amqp.password = "guest"

# Mock both pika and amqp_connection
sys.modules['pika'] = MagicMock()
sys.modules['amqp_connection'] = mock_amqp

# Mock boto3 before importing app
mock_boto3 = MagicMock()
mock_s3_client = MagicMock()
mock_boto3.client.return_value = mock_s3_client
sys.modules['boto3'] = mock_boto3

# Now we can safely import the application
from app import app, db, User, RequestModel, FileRequestAssoc, TransferRequest
from app import resolve_own_schedule, resolve_team_schedule, resolve_department_schedule
from app import resolve_own_requests, resolve_request, resolve_subordinates_request
from app import resolve_manager_list

class BaseTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
            'connect_args': {'check_same_thread': False},
            'poolclass': StaticPool
        }
        app.config['TESTING'] = True
        cls.client = app.test_client()

        # Patch external services
        cls.amqp_patcher = patch('amqp_connection.create_connection', return_value=mock_connection)
        cls.amqp_patcher.start()
        
        cls.s3_patcher = patch('boto3.client', return_value=mock_s3_client)
        cls.s3_patcher.start()

    @classmethod
    def tearDownClass(cls):
        cls.amqp_patcher.stop()
        cls.s3_patcher.stop()

    def setUp(self):
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()
        self._setup_test_data()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def _setup_test_data(self):
        # Create CEO (reports to self)
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

class TestAMQPConnection(BaseTestCase):
    """Test cases for AMQP connection functionality"""
    
    def setUp(self):
        super().setUp()
        self.mock_channel = MagicMock()
        self.mock_connection = MagicMock()
        self.mock_connection.channel.return_value = self.mock_channel
        mock_amqp.publish_to_broker = MagicMock()

    def test_publish_to_broker(self):
        """Test message publication to broker"""
        message = "Test message"
        subject = "Test subject"
        email = "test@example.com"
        
        mock_amqp.publish_to_broker(message, subject, email, self.mock_channel)
        mock_amqp.publish_to_broker.assert_called_once_with(
            message, subject, email, self.mock_channel
        )

    def test_check_exchange_success(self):
        """Test successful exchange check"""
        result = mock_amqp.check_exchange(self.mock_channel, "test_exchange", "topic")
        self.assertTrue(result)

    def test_check_exchange_failure(self):
        """Test exchange check failure"""
        original_check_exchange = mock_amqp.check_exchange
        try:
            mock_amqp.check_exchange = MagicMock(return_value=False)
            result = mock_amqp.check_exchange(self.mock_channel, "test_exchange", "topic")
            self.assertFalse(result)
        finally:
            mock_amqp.check_exchange = original_check_exchange

class FlaskAppTestCase(BaseTestCase):
    """Test cases for Flask application functionality"""

    @patch('app.User.position', new_callable=PropertyMock)
    def test_resolve_manager_list(self, mock_position):
        """Test resolving manager list"""
        mock_position.return_value = "Director"
        result = resolve_manager_list(130002)
        self.assertEqual(result['director_name'], "Jack Sim")
        self.assertIsInstance(result['manager_list'], list)
        self.assertTrue(any(manager['staff_id'] == 150008 for manager in result['manager_list']))

    def test_resolve_own_schedule(self):
        """Test own schedule resolution"""
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
        result = resolve_team_schedule(10, 2024, 5, 130002)
        self.assertIsInstance(result, dict)
        self.assertIn('team_schedule', result)
        self.assertEqual(result['reporting_manager'], 130002)
        self.assertGreater(result['team_count'], 0)
        
        schedule = result['team_schedule']
        self.assertTrue(any(day['date'] == '2024-10-05' for day in schedule))

    def test_team_schedule_as_regular_employee(self):
        with patch('app.User.query') as mock_user_query:
            # Set up mock user with role 2 (regular employee)
            mock_employee = MagicMock(spec=User)
            mock_employee.staff_id = 140894
            mock_employee.role = 2
            mock_employee.reporting_manager = 140001
            mock_employee.position = "Employee"
            mock_employee.staff_fname = "Rahim"
            mock_employee.staff_lname = "Khalid"
            mock_employee.dept = "Sales"

            # Mock the filter().first() and filter().all() calls
            mock_user_query.filter.return_value.first.return_value = mock_employee
            mock_user_query.filter.return_value.all.return_value = [mock_employee]

            # Mock the request query
            with patch('app.RequestModel.query') as mock_request_query:
                mock_request_query.filter.return_value.all.return_value = []

                # Execute the function
                result = resolve_team_schedule(10, 2024, 5, 140894)

                # Assertions
                self.assertIsInstance(result, dict)
                self.assertEqual(result['reporting_manager'], 140001)  # Confirming reporting manager is correct
                self.assertGreater(result['team_count'], 0)

                # Verify filter was called
                mock_user_query.filter.assert_any_call(ANY)

                # Verify schedule structure
                self.assertIn('team_schedule', result)
                schedule = result['team_schedule']
                self.assertIsInstance(schedule, list)

                # Verify schedule contents
                schedule_day = next((day for day in schedule if day['date'] == '2024-10-05'), None)
                self.assertIsNotNone(schedule_day)
                self.assertIn('availability', schedule_day)
                self.assertIn('available_count', schedule_day)

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
        response = self.client.post('/requests', json={'query': mutation})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
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
        response = self.client.post('/requests', json={'query': mutation})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['data']['acceptRejectRequest']['success'])

        updated_request = RequestModel.query.get(1)
        self.assertEqual(updated_request.status, "approved")
        self.assertEqual(updated_request.remarks, "Approved in test")

    def test_department_schedule_director(self):
        """Test department schedule for director"""
        with patch.object(User, 'position', new_callable=PropertyMock) as mock_position:
            mock_position.return_value = "Director"
            result = resolve_department_schedule(10, 2024, 140001, [140894])
            self.assertIsInstance(result, dict)
            self.assertEqual(result['department_name'], "Sales")
            self.assertIsInstance(result['dept_schedule'], list)

    def test_invalid_department_access(self):
        """Test invalid department schedule access"""
        with self.assertRaises(Exception) as context:
            resolve_department_schedule(10, 2024, 140894, None)
        self.assertIn("User is not a director", str(context.exception))

    def test_resolve_request(self):
        """Test resolving specific request"""
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

    def test_invalid_request(self):
        """Test resolving invalid request"""
        result = resolve_request(999)
        self.assertIsNone(result)

    def test_withdraw_request_mutations(self):
        """Test request withdrawal mutations"""
        # Test pending withdrawal
        mutation1 = '''
        mutation {
            withdrawPendingRequest(requestId: 1) {
                success
                message
            }
        }
        '''
        response = self.client.post('/requests', json={'query': mutation1})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['data']['withdrawPendingRequest']['success'])

        # Test approved withdrawal
        mutation2 = '''
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
        response = self.client.post('/requests', json={'query': mutation2})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['data']['withdrawApprovedRequest']['success'])

    def test_transfer_request_mutation(self):
        """Test transfer request mutation"""
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
        response = self.client.post('/requests', json={'query': mutation})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['data']['requestForTransfer']['success'])

if __name__ == '__main__':
    unittest.main()