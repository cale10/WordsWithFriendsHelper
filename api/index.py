'''
Vercel Serverless Function Entry Point
Authors: Elijah Sawyers
Emails: elijahsawyers@gmail.com
'''

import sys
import os

# Get the absolute path to the api directory
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)

# Add directories to Python path
sys.path.insert(0, current_dir)
sys.path.insert(0, project_root)

from flask import Flask, request, render_template, jsonify
import best_game_move

# Set up paths relative to project root
template_folder = os.path.join(project_root, 'dist', 'templates')
static_folder = os.path.join(project_root, 'dist', 'static')

app = Flask(__name__,
            template_folder=template_folder,
            static_folder=static_folder,
            static_url_path='/static')

@app.route('/')
def index():
    '''
    Main route, renders the application.
    '''
    return render_template('index.html')

@app.route('/bestGameMove', methods=['POST'])
def compute_best_game_move():
    '''
    Given gameboard data, return the best possible game move.
    '''
    return jsonify(best_game_move.compute(request.json))

# For local testing
if __name__ == '__main__':
    app.run()
