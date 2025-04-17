from flask import Blueprint, render_template, request, jsonify
from sqlalchemy.exc import IntegrityError
from ...models.user import User
from ...extensions import db, turnstile
import hashlib, re

register_bp = Blueprint('register', __name__, template_folder='templates')

@register_bp.route('/', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.form
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
        
        if not all([username, password, email]):
            return render_template('register.html', error='缺少必要字段', success=''), 400

        if not turnstile.verify():
            return render_template('register.html', error='验证失败', success=''), 400

        try:
            new_user = User(
                username=username,
                email=email,
                password_hash=password_hash,
            )
            db.session.add(new_user)
            db.session.commit()

            # -------- DEBUG --------
            users = User.query.all()
            for user in users:
                print(user.to_dict())
            # -------- DEBUG --------

            return render_template('register.html', error='' ,success='注册成功'), 200
        except IntegrityError:
            db.session.rollback()
            return render_template('register.html', error='用户名或邮箱已存在', success=''), 400
        except Exception as e:
            return render_template('register.html', error="ERROR:"+str(e), success=''), 500
    elif request.method == 'GET':
        return render_template('register.html', error='', success='')
