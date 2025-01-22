from flask import Flask, request, jsonify
from app.services.services import (
    get_image_path,
    get_image_results,
    filter_results,
    find_most_likely_username,
    is_valid_url,
    prepare_display_data,
)
from werkzeug.utils import secure_filename
import tempfile
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes by default



@app.route('/')
def home():
    """
    Welcome endpoint to ensure the API is running.
    """
    return "Welcome to the backend service API!"

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    """
    Endpoint to upload an image and start the search process.
    Expects an image file in the request body.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    image_file = request.files['image']

    try:
        # Save the uploaded file to a temporary location
        filename = secure_filename(image_file.filename)
        temp_dir = tempfile.mkdtemp()  # Create a temporary directory
        file_path = os.path.join(temp_dir, filename)
        image_file.save(file_path)

        # Call the get_image_results function with the temporary file path
        error, results = get_image_results(file_path)

        # Clean up: Delete the temporary file
        os.remove(file_path)
        os.rmdir(temp_dir)

        if error:
            return jsonify({'error': error}), 500
        return jsonify({'results': results}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/filter-results', methods=['POST'])
def filter_results_endpoint():
    """
    Endpoint to filter results based on scores and platform URLs.
    Expects JSON data with 'results' key containing search results.
    """
    data = request.get_json()
    if not data or 'results' not in data:
        return jsonify({'error': 'No results provided in the request'}), 400
    
    results = data['results']
    instagram_usernames, linkedin_usernames, twitter_usernames, facebook_usernames, other_usernames = filter_results(results)
    return jsonify({
        'instagram': instagram_usernames,
        'linkedin': linkedin_usernames,
        'twitter': twitter_usernames,
        'facebook': facebook_usernames,
        'others': other_usernames
    }), 200

@app.route('/api/prepare-display-data', methods=['POST'])
def prepare_display_data_endpoint():
    """
    Endpoint to prepare display data for the frontend.
    Expects JSON data with usernames for each platform.
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Invalid request data'}), 400

    try:
        instagram_usernames = data.get('instagram', [])
        linkedin_usernames = data.get('linkedin', [])
        twitter_usernames = data.get('twitter', [])
        facebook_usernames = data.get('facebook', [])
        other_usernames = data.get('others', [])
        print("working1")
        # Call the prepare_display_data function
        display_data = prepare_display_data(
            instagram_usernames,
            linkedin_usernames,
            twitter_usernames,
            facebook_usernames,
            other_usernames
        )
        print("working2")

        return jsonify({'display_data': display_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/most-likely-username', methods=['POST'])
def most_likely_username():
    """
    Endpoint to find the most likely username from filtered results.
    Expects JSON data with usernames for Instagram, Facebook, Twitter, and LinkedIn.
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid request data'}), 400

    try:
        instagram_usernames = data.get('instagram', [])
        facebook_usernames = data.get('facebook', [])
        twitter_usernames = data.get('twitter', [])
        linkedin_usernames = data.get('linkedin', [])

        most_likely = find_most_likely_username(
            instagram_usernames,
            facebook_usernames,
            twitter_usernames,
            linkedin_usernames
        )
        return jsonify({'most_likely_usernames': most_likely}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/validate-url', methods=['POST'])
def validate_url():
    """
    Endpoint to validate whether a given URL is well-formed.
    Expects JSON data with a 'url' key.
    """
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'No URL provided'}), 400

    url = data['url']
    is_valid = is_valid_url(url)
    return jsonify({'url': url, 'is_valid': is_valid}), 200

if __name__ == "__main__":
    app.run(debug=True)

    print("Suuuuuiiiiiiii you losers")
    image_path = get_image_path()
    error, urls_images = get_image_results(image_path)
    print("Search Completed")

    # if urls_images:
    #     for im in urls_images:      # Iterate search results
    #         score = im['score']     # 0 to 100 score how well the face is matching found image
    #         url = im['url']         # url to webpage where the person was found
    #         image_base64 = im['base64']     # thumbnail image encoded as base64 string
    #         print(f"{score} {url} {image_base64[:32]}...")
    # else:
    #     print(error)

    instagram_usernames, linkedin_usernames, twitter_usernames, facebook_usernames = filter_results(urls_images)

    most_likely = find_most_likely_username(instagram_usernames, facebook_usernames, twitter_usernames, linkedin_usernames)
    
    for result in most_likely:
        print(f"Username: {result['username']}, Score: {result['score']}, Platforms: {result['platforms']}")


    if instagram_usernames:
        print("Instagram")
        print(instagram_usernames)
    if linkedin_usernames:
        print("LinkedIn")
        print(linkedin_usernames)
    if facebook_usernames:
        print("Facebook")
        print(facebook_usernames)
    if twitter_usernames:
        print("Twitter")
        print(twitter_usernames)

    print("Thanks for trying this out BOI")

    print("Feel free to try again")
    

    