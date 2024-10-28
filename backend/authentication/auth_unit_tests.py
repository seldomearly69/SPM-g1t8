import unittest, os, hashlib
from unittest.mock import patch, MagicMock
from app import app  # Import the Flask app

os.environ["FLASK_ENV"] = "testing"

password = "password"
sha256_hash = hashlib.sha256()
sha256_hash.update(password.encode('utf-8'))

@patch('app.conn')
class TestAuthenticationAPI(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_successful_authentication(self, mock_conn):
        
        mock_cursor = MagicMock()
        
        mock_cursor.fetchone.return_value = [
            1, 'John', 'Doe', None, 'Manager', None, 'john.doe@example.com', None, None, 'Admin', 
            sha256_hash.hexdigest()  # Hash for 'password'
        ]
        mock_conn.cursor.return_value = mock_cursor

        test_data = {"email": "john.doe@example.com", "password": "password"}
        response = self.app.post('/authenticate', json=test_data)

        
        self.assertEqual(response.status_code, 200)
        self.assertIn("staff_id", response.json)
        self.assertEqual(response.json["name"], "John Doe")

    def test_wrong_password(self, mock_conn):
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = [
            1, 'John', 'Doe', None, 'Manager', None, 'john.doe@example.com', None, None, 'Admin', 
            sha256_hash.hexdigest()  # Hash for 'password'
        ]
        mock_conn.cursor.return_value = mock_cursor

        test_data = {"email": "john.doe@example.com", "password": "wrongpassword"}
        response = self.app.post('/authenticate', json=test_data)
        
        self.assertEqual(response.status_code, 403)
        self.assertIn("Error", response.json)
        self.assertEqual(response.json["Error"], "Wrong password")

    def test_email_not_exist(self, mock_conn):
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = None
        mock_conn.cursor.return_value = mock_cursor

        test_data = {"email": "nonexistent@example.com", "password": "password"}
        response = self.app.post('/authenticate', json=test_data)
    

        self.assertEqual(response.status_code, 404)
        self.assertIn("Error", response.json)
        self.assertEqual(response.json["Error"], "Email does not exist")

    def test_missing_fields(self, mock_conn):
        test_data = {"email": "john.doe@example.com"}
        response = self.app.post('/authenticate', json=test_data)
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("Error", response.json)
        self.assertEqual(response.json["Error"], "Missing required fields")

    def test_database_error(self, mock_conn):
        mock_conn.cursor.side_effect = Exception("Database error")

        test_data = {"email": "john.doe@example.com", "password": "password"}
        response = self.app.post('/authenticate', json=test_data)
        
        self.assertEqual(response.status_code, 500)
        self.assertIn("Error", response.json)
        self.assertEqual(response.json["Error"], "An error occurred during authentication.")

if __name__ == '__main__':
    unittest.main()
