from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from core.config import SECRET_KEY, ALGORITHM
from itsdangerous import URLSafeTimedSerializer
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    # bcrypt supports max 72 bytes; truncate if longer
    return pwd_context.hash(password[:72])

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password[:72], hashed_password)

def create_access_token(data: dict, expires_delta: int = 60*24):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



def generate_token(email: str, purpose: str, expires_in: int = 3600*24):
    serializer = URLSafeTimedSerializer(SECRET_KEY, salt=purpose)
    return serializer.dumps(email)

def verify_token(token: str, purpose: str, max_age: int = 3600*24):
    serializer = URLSafeTimedSerializer(SECRET_KEY, salt=purpose)
    try:
        email = serializer.loads(token, max_age=max_age)
    except Exception:
        return None
    return email
