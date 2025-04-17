from flask_sqlalchemy import SQLAlchemy
from flask_turnstile import Turnstile

db = SQLAlchemy()
turnstile = Turnstile()