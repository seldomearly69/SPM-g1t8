import unittest
from unittest.mock import patch, MagicMock
from app import *
from datetime import date, datetime

class FlaskAppTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Set up the Flask test client and test database."""
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['TESTING'] = True
        cls.client = app.test_client()
        with app.app_context():
            db.create_all()

            # Adding test users
            cls.test_users = [
                User(staff_id=130002, staff_fname="Jack", staff_lname="Sim", dept="CEO", position="MD", country="Singapore", email="jack.sim@allinone.com.sg", reporting_manager=None, role=1, password="hashed_password"),
                User(staff_id=140001, staff_fname="Derek", staff_lname="Tan", dept="Sales", position="Director", country="Singapore", email="Derek.Tan@allinone.com.sg", reporting_manager=130002, role=1, password="hashed_password"),
                User(staff_id=140894, staff_fname="Rahim", staff_lname="Khalid", dept="Sales", position="Sales Manager", country="Singapore", email="Rahim.Khalid@allinone.com.sg", reporting_manager=140001, role=3, password="hashed_password"),
                User(staff_id=150008, staff_fname="Eric", staff_lname="Loh", dept="Marketing", position="Marketing Manager", country="Singapore", email="Eric.Loh@allinone.com.sg", reporting_manager=130002, role=3, password="hashed_password")
            ]
            cls.test_requests = [
                RequestModel(requesting_staff=130002, year=2024, month=10, day=5, type="AM", status="pending", approving_manager=130002, created_at=date(2024, 10, 1), reason="Family event"),
                RequestModel(requesting_staff=140001, year=2024, month=10, day=6, type="PM", status="approved", approving_manager=130002, created_at=date(2024, 10, 2), reason="Doctor appointment"),
                RequestModel(requesting_staff=140894, year=2024, month=10, day=7, type="FULL", status="rejected", approving_manager=140001, created_at=date(2024, 10, 3), reason="Vacation"),
                RequestModel(requesting_staff=150008, year=2024, month=10, day=8, type="AM", status="pending", approving_manager=130002, created_at=date(2024, 10, 4), reason="Team building")
            ]

            db.session.bulk_save_objects(cls.test_users)
            db.session.bulk_save_objects(cls.test_requests)
            db.session.commit()

    @classmethod
    def tearDownClass(cls):
        """Tear down the database after all tests."""
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_resolve_own_schedule(self):
        """Test the own_schedule resolver function."""
        with app.app_context():
            result = resolve_own_schedule(10, 2024, 130002)
            
            self.assertEqual(result['month'], 10)
            self.assertEqual(result['year'], 2024)
            self.assertIsInstance(result['schedule'], list)
            
            # Check if the specific request is in the schedule
            request_day = next((day for day in result['schedule'] if day['date'] == '2024-10-05'), None)
            self.assertIsNotNone(request_day)
            self.assertEqual(request_day['availability'], 'wfh')
            self.assertEqual(request_day['type'], 'AM')
            self.assertTrue(request_day['is_pending'])

    def test_resolve_team_schedule(self):
        """Test the team_schedule resolver function."""
        with app.app_context():
            result = resolve_team_schedule(10, 2024, 5, 130002)
            
            self.assertIsInstance(result, dict)
            self.assertIn('team_schedule', result)
            self.assertEqual(result['reporting_manager'], 130002)
            self.assertGreater(result['team_count'], 0)
            
            # Check if the schedule contains the correct date
            schedule_day = next((day for day in result['team_schedule'] if day['date'] == '2024-10-05'), None)
            self.assertIsNotNone(schedule_day)

    @patch('app.User.query')
    def test_resolve_department_schedule(self, mock_user_query):
        """Test the department_schedule resolver function."""
        mock_user = MagicMock()
        mock_user.position = "Director"
        mock_user.dept = "Sales"
        mock_user_query.filter.return_value.first.return_value = mock_user
        
        mock_managers = [MagicMock(), MagicMock()]
        mock_user_query.filter.return_value.all.return_value = mock_managers
        
        with patch('app.retrieve_team_schedule') as mock_retrieve_team_schedule:
            mock_retrieve_team_schedule.return_value = {"team_schedule": "mocked_schedule"}
            
            result = resolve_department_schedule(10, 2024, 140001)
            
            self.assertIsInstance(result, dict)
            self.assertEqual(result['department_name'], "Sales")
            self.assertIsInstance(result['dept_schedule'], list)
            self.assertEqual(len(result['dept_schedule']), len(mock_managers))

    def test_resolve_own_requests(self):
        """Test the own_requests resolver function."""
        with app.app_context():
            result = resolve_own_requests(140001)
            
            self.assertIsInstance(result, dict)
            self.assertIn('requests', result)
            self.assertIn('approving_manager', result)
            self.assertEqual(result['approving_manager'], "Jack Sim")
            
            # Check if the specific request is in the result
            request = next((req for req in result['requests'] if req['date'] == '2024-10-06'), None)
            self.assertIsNotNone(request)
            self.assertEqual(request['type'], 'PM')
            self.assertEqual(request['status'], 'approved')

    def test_resolve_request(self):
        """Test the request resolver function."""
        with app.app_context():
            request_id = self.test_requests[0].request_id
            result = resolve_request(request_id)
            
            expected_result = {
                "request_id": request_id,
                "date": "2024-10-05",
                "type": "AM",
                "status": "pending",
                "reason": "Family event",
                "remarks": None
            }
            self.assertEqual(result, expected_result)

    def test_resolve_request_invalid(self):
        """Test the request resolver with an invalid request ID."""
        with app.app_context():
            result = resolve_request(9999)  # Assuming 9999 is invalid
            self.assertIsNone(result)

    def test_resolve_subordinates_request(self):
        """Test the subordinates_request resolver function."""
        with app.app_context():
            result = resolve_subordinates_request(130002)
            
            self.assertIsInstance(result, list)
            self.assertGreater(len(result), 0)
            
            # Check if the subordinate's request is in the result
            subordinate_request = next((req for req in result if req['requesting_staff_name'] == "Derek Tan"), None)
            self.assertIsNotNone(subordinate_request)
            self.assertEqual(subordinate_request['date'], '2024-10-06')
            self.assertEqual(subordinate_request['type'], 'PM')
            self.assertEqual(subordinate_request['status'], 'approved')

    def test_create_request_mutation(self):
        """Test the create_request mutation."""
        mutation = '''
        mutation {
            createRequest(
                staffId: 140894,
                reason: "Test reason",
                type: "AM",
                date: ["2024-11-15T00:00:00"]
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
            self.assertTrue(data['data']['createRequest']['success'])

    def test_manager_list_query(self):
        """Test the manager_list query."""
        query = '''
        query {
            managerList(directorId: 130002) {
                directorName
                managerList {
                    staffId
                    position
                    name
                }
            }
        }
        '''
        with app.app_context():
            response = self.client.post('/schedule', json={'query': query})
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            self.assertIn('managerList', data['data'])
            self.assertEqual(data['data']['managerList']['directorName'], "Jack Sim")
            self.assertIsInstance(data['data']['managerList']['managerList'], list)

    # Add more tests here for edge cases and error handling

if __name__ == '__main__':
    unittest.main()
