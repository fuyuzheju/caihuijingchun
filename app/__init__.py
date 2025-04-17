from flask import Flask, render_template, request, jsonify, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os
from .extensions import db, turnstile

def create_app(config_class=None):
    app = Flask(__name__, template_folder='templates', instance_relative_config=True)
    os.makedirs(app.instance_path, exist_ok=True)
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=0)
    
    # 基础配置
    app.config.from_mapping(
        SQLALCHEMY_DATABASE_URI=f'sqlite:///{os.path.join(app.instance_path, "users.db")}',
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )

    app.config['TURNSTILE_SITE_KEY'] = "0x4AAAAAABMtsHw0c0sKADfT"
    app.config['TURNSTILE_SECRET_KEY'] = "0x4AAAAAABMtsBHf457peaefonCRD9DwiQs"
    
    # 初始化扩展
    db.init_app(app)
    turnstile.init_app(app)
    
    # 注册蓝图
    with app.app_context():
        from .routes import register_bp, game_bp
        app.register_blueprint(register_bp, url_prefix='/register')
        app.register_blueprint(game_bp, url_prefix='/game')

        @app.route('/')
        def index():
            return render_template('index.html')
        
        @app.errorhandler(404)
        def page_not_found(e):
            return render_template('404.html'), 404
        
        @app.errorhandler(500)
        def internal_server_error(e):
            return render_template('500.html'), 500
        
        # 创建数据库表
        db.create_all()
    
    return app