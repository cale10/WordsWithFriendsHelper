'''
Vercel Serverless Function Entry Point
Authors: Elijah Sawyers
Emails: elijahsawyers@gmail.com
'''

import sys
import os

# Add the project root to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from flask import Flask, request, render_template, jsonify
import best_game_move

app = Flask(__name__,
            template_folder='../dist/templates',
            static_folder='../dist/static',
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

# Vercel serverless handler
def handler(request, context):
    return app(request, context)

# For local testing
if __name__ == '__main__':
    app.run()
