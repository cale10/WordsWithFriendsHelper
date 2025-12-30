'''
Vercel Serverless Function Entry Point
Authors: Elijah Sawyers
Emails: elijahsawyers@gmail.com
'''

import sys
import os

# Get the absolute path - Vercel puts everything at /var/task
current_dir = os.path.dirname(os.path.abspath(__file__))

# For Vercel, go up one level from api/ to get to project root
if '/var/task' in current_dir:
    # On Vercel
    project_root = '/var/task'
else:
    # Local development
    project_root = os.path.dirname(current_dir)

# Add directories to Python path
sys.path.insert(0, current_dir)
sys.path.insert(0, project_root)

from flask import Flask, request, render_template, jsonify
import best_game_move

# Set up paths
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

# Debug route to check paths (remove after debugging)
@app.route('/debug')
def debug():
    import json
    info = {
        'current_dir': current_dir,
        'project_root': project_root,
        'template_folder': template_folder,
        'static_folder': static_folder,
        'template_exists': os.path.exists(template_folder),
        'static_exists': os.path.exists(static_folder),
        'dist_contents': os.listdir(os.path.join(project_root, 'dist')) if os.path.exists(os.path.join(project_root, 'dist')) else 'dist not found',
        'static_contents': os.listdir(static_folder) if os.path.exists(static_folder) else 'static not found'
    }
    return jsonify(info)

# For local testing
if __name__ == '__main__':
    app.run()
