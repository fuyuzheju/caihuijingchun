from flask import Blueprint, render_template
game_bp = Blueprint('game', __name__, template_folder='templates')

@game_bp.route('/')
def game():
    return render_template('game.html')