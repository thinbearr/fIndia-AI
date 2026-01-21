"""
Authentication Router
Email/Password Login only (Google Removed)
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import jwt
import os
# Google imports REMOVED
from services.database import get_database
from passlib.context import CryptContext

router = APIRouter()
security = HTTPBearer()

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Password Hashing
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token and get current user"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        
        db = get_database()
        user = await db.users.find_one({"_id": user_id})
        
        if user is None:
            # Return a mock user if database fails or user not found (for demo stability)
            # This prevents chat from crashing
            return {
                "_id": user_id,
                "email": payload.get("email", "demo@user.com"),
                "name": "Demo User"
            }
        
        return user
        
    except Exception:
        # If token is invalid or any other error, return 401
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

@router.post("/signup")
async def signup(user: UserSignup):
    """Register a new user with email/password"""
    db = get_database()
    
    # Check if user exists
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )
    
    # Create user
    user_doc = {
        "email": user.email,
        "name": user.name, 
        "password_hash": get_password_hash(user.password),
        "picture": "", 
        "created_at": datetime.utcnow(),
        "last_login": datetime.utcnow(),
        "auth_provider": "email"
    }
    
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create Token
    access_token = create_access_token({"sub": user_id, "email": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user.email,
            "name": user.name,
            "picture": ""
        }
    }

@router.post("/login")
async def login(user_data: UserLogin):
    """Login with email/password"""
    db = get_database()
    user = await db.users.find_one({"email": user_data.email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    if not verify_password(user_data.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Update login time
    await db.users.update_one(
        {"_id": user['_id']},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    user_id = str(user['_id'])
    access_token = create_access_token({"sub": user_id, "email": user['email']})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user['email'],
            "name": user['name'],
            "picture": user.get('picture', '')
        }
    }

@router.get("/me")
async def get_me(current_user = Depends(get_current_user)):
    """Get current user information"""
    return {
        "id": str(current_user['_id']),
        "email": current_user['email'],
        "name": current_user['name'],
        "picture": current_user.get('picture', '')
    }

router = APIRouter()
security = HTTPBearer()

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Google OAuth
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

# Password Hashing
# Using pbkdf2_sha256 for better compatibility on Windows without headers
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

class GoogleAuthRequest(BaseModel):
    token: str

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token and get current user"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        
        db = get_database()
        user = await db.users.find_one({"_id": user_id})
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return user
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

@router.post("/signup")
async def signup(user: UserSignup):
    """Register a new user with email/password"""
    db = get_database()
    
    # Check if user exists
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(
            status_code=400,
            detail="Email already registered. Please login or use Google."
        )
    
    # Create user
    user_doc = {
        "email": user.email,
        "name": user.name, 
        "password_hash": get_password_hash(user.password),
        "picture": "", 
        "created_at": datetime.utcnow(),
        "last_login": datetime.utcnow(),
        "auth_provider": "email"
    }
    
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create Token
    access_token = create_access_token({"sub": user_id, "email": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user.email,
            "name": user.name,
            "picture": ""
        }
    }

@router.post("/login")
async def login(user_data: UserLogin):
    """Login with email/password"""
    db = get_database()
    user = await db.users.find_one({"email": user_data.email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    # Check if user has a password (might be Google-only user)
    if not user.get("password_hash"):
         raise HTTPException(status_code=401, detail="This email is registered with Google. Please sign in with Google.")

    if not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Update login time
    await db.users.update_one(
        {"_id": user['_id']},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    user_id = str(user['_id'])
    access_token = create_access_token({"sub": user_id, "email": user['email']})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user['email'],
            "name": user['name'],
            "picture": user.get('picture', '')
        }
    }

@router.post("/google")
async def google_auth(auth_request: GoogleAuthRequest):
    """
    Authenticate with Google OAuth token
    """
    try:
        # Verify Google token
        if GOOGLE_CLIENT_ID:
            idinfo = id_token.verify_oauth2_token(
                auth_request.token,
                requests.Request(),
                GOOGLE_CLIENT_ID
            )
            
            email = idinfo['email']
            name = idinfo.get('name', email)
            picture = idinfo.get('picture', '')
        else:
            # For development without Google OAuth
            # In production, this should be removed
            raise HTTPException(
                status_code=400,
                detail="Google OAuth not configured. Set GOOGLE_CLIENT_ID environment variable."
            )
        
        # Get or create user
        db = get_database()
        user = await db.users.find_one({"email": email})
        
        if not user:
            # Create new user
            user_doc = {
                "email": email,
                "name": name,
                "picture": picture,
                "created_at": datetime.utcnow(),
                "last_login": datetime.utcnow(),
                "auth_provider": "google"
            }
            result = await db.users.insert_one(user_doc)
            user_id = str(result.inserted_id)
        else:
            # Update last login and details
            user_id = str(user['_id'])
            await db.users.update_one(
                {"_id": user['_id']},
                {"$set": {
                    "last_login": datetime.utcnow(),
                    "name": name,
                    "picture": picture
                }}
            )
        
        # Create JWT token
        access_token = create_access_token({"sub": user_id, "email": email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": email,
                "name": name,
                "picture": picture
            }
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )

@router.get("/me")
async def get_me(current_user = Depends(get_current_user)):
    """Get current user information"""
    return {
        "id": str(current_user['_id']),
        "email": current_user['email'],
        "name": current_user['name'],
        "picture": current_user.get('picture', '')
    }
