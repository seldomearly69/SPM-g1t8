import unittest
from unittest.mock import patch
from app import *

class FlaskAppTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Set up the Flask test client and test database."""
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['TESTING'] = True
        cls.client = app.test_client()
        with app.app_context():
            db.create_all()

            # Adding test users similar to employees.csv
            cls.test_users = [
                User(staff_id=130002, staff_fname="Jack", staff_lname="Sim", dept="CEO", position="MD", country="Singapore", email="jack.sim@allinone.com.sg", reporting_manager=None, role=1, password="hashed_password"),
                User(staff_id=140001, staff_fname="Derek", staff_lname="Tan", dept="Sales", position="Director", country="Singapore", email="Derek.Tan@allinone.com.sg", reporting_manager=130002, role=1, password="hashed_password"),
                User(staff_id=140894, staff_fname="Rahim", staff_lname="Khalid", dept="Sales", position="Sales Manager", country="Singapore", email="Rahim.Khalid@allinone.com.sg", reporting_manager=140001, role=3, password="hashed_password")
                # Add more users as needed
            ]
            cls.test_request = RequestModel(requesting_staff=130002, year=2024, month=10, day=5, type="AM", status="pending", approving_manager=130002, reason="Family event")

            db.session.bulk_save_objects(cls.test_users)
            db.session.add(cls.test_request)
            db.session.commit()

    @classmethod
    def tearDownClass(cls):
        """Tear down the database after all tests."""
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_resolve_own_schedule(self):
        """Test the own_schedule resolver function."""
        with patch('app.RequestModel.query.filter') as mock_filter:
            # Mocking the return value to return only the specific request for the test
            mock_filter.return_value.all.return_value = [self.test_request]
            
            # Call the function with the correct parameters
            result = resolve_own_schedule(10, 2024, 130002)
            
            # Adjust the expected schedule according to the actual return structure of resolve_own_schedule
            expected_schedule = {
                "month": 10,
                "year": 2024,
                "schedule": [
                    {
                        "date": "2024-10-05",
                        "availability": "wfh",  # Assuming this is expected
                        "type": "AM",
                        "is_pending": True
                    },
                ]
            }
            
            # Debugging output for expected vs actual
            print("Expected:", expected_schedule)
            print("Actual:", result)
            
            # Assert the result matches the expected output
            self.assertEqual(result, expected_schedule)


    def test_resolve_team_schedule(self):
        """Test the team_schedule resolver function."""
        with patch('app.RequestModel.query.filter') as mock_filter:
            mock_filter.return_value.all.return_value = [self.test_request]
            result = resolve_team_schedule(10, 2024, 5, 130002)  # Using a valid staff_id
            
            self.assertIsInstance(result, dict)
            self.assertIn("team_schedule", result)

    @patch('app.retrieve_team_schedule')
    def test_resolve_department_schedule(self, mock_retrieve_team_schedule):
        """Test the department_schedule resolver function."""
        mock_retrieve_team_schedule.return_value = {"team_schedule": "mocked_schedule"}
        result = resolve_department_schedule(10, 2024, 140001)
        
        self.assertIsInstance(result, dict)
        self.assertIn("dept_schedule", result)

    def test_resolve_own_requests(self):
        """Test the own_requests resolver function."""
        with patch('app.User.query.get') as mock_get:
            mock_get.side_effect = self.test_users[:2]  # Assuming the first user has a manager
            result = resolve_own_requests(140001)

            self.assertIsInstance(result, dict)
            self.assertIn("requests", result)
            self.assertIn("approving_manager", result)  # Check manager is returned
            self.assertEqual(result["approving_manager"], "Jack Sim")  # Adjust based on your logic

    def test_resolve_request(self):
        """Test the request resolver function."""
        result = resolve_request(self.test_request.request_id)
        
        expected_result = {
            "request_id": self.test_request.request_id,
            "date": "2024-10-05",
            "type": self.test_request.type,
            "status": self.test_request.status,
            "reason": self.test_request.reason,
            "remarks": self.test_request.remarks
        }
        self.assertEqual(result, expected_result)

    def test_resolve_request_invalid(self):
        """Test the request resolver with an invalid request ID."""
        result = resolve_request(9999)  # Assuming 9999 is invalid
        self.assertIsNone(result)  # Adjust based on how you handle non-existent requests

if __name__ == '__main__':
    unittest.main()

