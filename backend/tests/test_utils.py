"""
Tests for utility functions.
"""

import pytest
from datetime import timedelta

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from auth.utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    verify_token
)


class TestPasswordHashing:
    """Tests for password hashing functions."""
    
    def test_hash_password(self):
        """Test password hashing returns different value."""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        assert hashed != password
        assert len(hashed) > 0
    
    def test_verify_correct_password(self):
        """Test verifying correct password returns True."""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        assert verify_password(password, hashed) is True
    
    def test_verify_wrong_password(self):
        """Test verifying wrong password returns False."""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        assert verify_password("wrongpassword", hashed) is False
    
    def test_different_hashes_for_same_password(self):
        """Test same password produces different hashes (salt)."""
        password = "testpassword123"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)
        
        assert hash1 != hash2
        assert verify_password(password, hash1) is True
        assert verify_password(password, hash2) is True


class TestJWTTokens:
    """Tests for JWT token functions."""
    
    def test_create_access_token(self):
        """Test creating access token."""
        data = {"sub": "testuser"}
        token = create_access_token(data)
        
        assert token is not None
        assert len(token) > 0
    
    def test_create_token_with_expiry(self):
        """Test creating token with custom expiry."""
        data = {"sub": "testuser"}
        expires = timedelta(hours=1)
        token = create_access_token(data, expires_delta=expires)
        
        assert token is not None
    
    def test_verify_valid_token(self):
        """Test verifying valid token returns username."""
        username = "testuser"
        token = create_access_token({"sub": username})
        
        result = verify_token(token)
        
        assert result == username
    
    def test_verify_invalid_token(self):
        """Test verifying invalid token returns None."""
        result = verify_token("invalid-token")
        
        assert result is None
    
    def test_verify_tampered_token(self):
        """Test verifying tampered token returns None."""
        token = create_access_token({"sub": "testuser"})
        tampered = token[:-5] + "xxxxx"
        
        result = verify_token(tampered)
        
        assert result is None
