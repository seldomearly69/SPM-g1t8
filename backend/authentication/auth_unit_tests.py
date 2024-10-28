import unittest
from unittest.mock import patch, MagicMock
from app import app  # Import the Flask app

class TestAuthenticationAPI(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('app.conn')
    def test_successful_authentication(self, mock_conn):
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = [
            130002, 'Jack', 'Sim', None, 'CEO', None, 'jack.sim@allinone.com.sg', None, None, 'Admin', 
            '5e884898da28047151d0e56f8dc6292773603d0d6aabbddcbf6d6df5a56aa1f6'  # Hash for 'password'
        ]
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        test_data = {"email": "john.doe@example.com", "password": "password"}
        response = self.app.post('/authenticate', json=test_data)

        
        self.assertEqual(response.status_code, 200)
        self.assertIn("staff_id", response.json)
        self.assertEqual(response.json["name"], "John Doe")

    @patch('app.conn')
    def test_wrong_password(self, mock_conn):
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = [
            1, 'John', 'Doe', None, 'Manager', None, 'john.doe@example.com', None, None, 'Admin',
            '5e884898da28047151d0e56f8dc6292773603d0d6aabbddcbf6d6df5a56aa1f6'
        ]
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        test_data = {"email": "john.doe@example.com", "password": "wrongpassword"}
        response = self.app.post('/authenticate', json=test_data)
        
        self.assertEqual(response.status_code, 403)
        self.assertIn("Error", response.json)
        self.assertEqual(response.json["Error"], "Wrong password")

    @patch('app.conn')
    def test_email_not_exist(self, mock_conn):
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = None
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

        test_data = {"email": "nonexistent@example.com", "password": "password"}
        response = self.app.post('/authenticate', json=test_data)
        
        print(response.json)

        self.assertEqual(response.status_code, 404)
        self.assertIn("Error", response.json)
        self.assertEqual(response.json["Error"], "Email does not exist")

    @patch('app.conn')
    def test_missing_fields(self, mock_conn):
        test_data = {"email": "john.doe@example.com"}
        response = self.app.post('/authenticate', json=test_data)
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("Error", response.json)
        self.assertEqual(response.json["Error"], "Missing required fields")

    @patch('app.conn')
    def test_database_error(self, mock_conn):
        mock_conn.cursor.side_effect = Exception("Database error")

        test_data = {"email": "john.doe@example.com", "password": "password"}
        response = self.app.post('/authenticate', json=test_data)
        
        self.assertEqual(response.status_code, 500)
        self.assertIn("Error", response.json)
        self.assertEqual(response.json["Error"], "An error occurred during authentication.")

if __name__ == '__main__':
    unittest.main()
