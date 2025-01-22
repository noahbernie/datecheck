# app/services/services.py
import os
from urllib.parse import urlparse
import time
import requests 
import urllib.request
from collections import Counter
import re
from difflib import SequenceMatcher
# from instascrape import * # type: ignore

TESTING_MODE = False
APITOKEN = 'uXfDEJnPDTFB/riggN9gZvhnmwaYtMTEV6e8Kce9cwjNKvIs/+CvGgN4agdwhqbJYaIjIHQsmXo=' # Your API Token

def get_image_results(image_file):
    if TESTING_MODE:
        print('****** TESTING MODE search, results are inacurate, and queue wait is long, but credits are NOT deducted ******')

    site='https://facecheck.id'
    headers = {'accept': 'application/json', 'Authorization': APITOKEN}
    files = {'images': open(image_file, 'rb'), 'id_search': None}
    response = requests.post(site+'/api/upload_pic', headers=headers, files=files).json()

    if response['error']:
        return f"{response['error']} ({response['code']})", None

    id_search = response['id_search']
    print(response['message'] + ' id_search='+id_search)
    json_data = {'id_search': id_search, 'with_progress': True, 'status_only': False, 'demo': TESTING_MODE}

    while True:
        response = requests.post(site+'/api/search', headers=headers, json=json_data).json()
        if response['error']:
            return f"{response['error']} ({response['code']})", None
        if response['output']:
            return None, response['output']['items']
        print(f'{response["message"]} progress: {response["progress"]}%')
        time.sleep(1)

def get_image_path():
    """
    Prompts the user for an image path or URL, validates it, and returns the value.
    Returns:
        str: A valid image path or URL.
    """
    while True:
        # Prompt user for input
        image_path = input("Please provide the image path or URL: ").strip()
        
        # Validate as URL
        if is_valid_url(image_path):
            print("Valid URL provided.")
            return image_path
        
        # Validate as file path
        elif os.path.isfile(image_path):
            print("Valid file path provided.")
            return image_path
        
        else:
            print("Invalid input. Please provide a valid image URL or file path.")


def filter_results(results):
    # Threshold for filtering results
    score_threshold = 75

    # Lists to store usernames
    instagram_usernames = []
    linkedin_usernames = []
    facebook_usernames = []
    twitter_usernames = []
    other_usernames = []  # Array to store other URLs/usernames

    # Define regex patterns for each platform
    patterns = {
        'instagram': r"instagram\.com/([a-zA-Z0-9_.-]+)",
        'linkedin': r"linkedin\.com/in/([a-zA-Z0-9_-]+)",
        'facebook': r"facebook\.com/([a-zA-Z0-9.]+)",
        'twitter': r"x\.com/([a-zA-Z0-9_-]+)"
    }

    # Iterate over the results
    for img in results:
        for t in img.keys():
            print(t)
        score = img['score']
        print(score)
        url = img['url']
        print(url)
        if score > score_threshold:
            matched = False

            # Match each platform using regex
            if 'instagram.com' in url:
                match = re.search(patterns['instagram'], url)
                if match:
                    instagram_usernames.append((url, match.group(1),score))
                    matched = True

            if 'linkedin.com/in/' in url:
                match = re.search(patterns['linkedin'], url)
                if match:
                    linkedin_usernames.append((url, match.group(1),score))
                    matched = True

            if 'facebook.com' in url:
                match = re.search(patterns['facebook'], url)
                if match:
                    facebook_usernames.append((url, match.group(1),score))
                    matched = True

            if 'x.com' in url:
                match = re.search(patterns['twitter'], url)
                if match:
                    twitter_usernames.append((url, match.group(1),score))
                    matched = True

            # If the URL does not match any platform, add it to other_usernames
            if not matched:
                other_usernames.append((url, url,score))

    return instagram_usernames, linkedin_usernames, twitter_usernames, facebook_usernames, other_usernames

# def is_name_in_username(username, names_list):
#     for name in names_list:
#         if SequenceMatcher(None, username.lower(), name.lower()).ratio() > 0.8:  # 80% match
#             return True
#     return False

def find_most_likely_username(instagram_usernames, facebook_usernames, twitter_usernames, linkedin_usernames):
    # Combine all buckets into a dictionary
    all_buckets = {
        "Instagram": instagram_usernames,
        "Facebook": facebook_usernames,
        "Twitter": twitter_usernames,
        "LinkedIn": linkedin_usernames
    }

    for bucket in all_buckets:
        print(bucket)
    
    # Flatten all usernames into a single list with sources
    all_usernames = []
    for platform, usernames in all_buckets.items():
        for username in usernames:
            all_usernames.append((username, platform))
    
    # Compare usernames for overlap or similarity
    username_scores = {}
    for i, (username1, platform1) in enumerate(all_usernames):
        for j, (username2, platform2) in enumerate(all_usernames):
            if i < j:  # Avoid duplicate comparisons
                # Compute similarity score
                similarity = SequenceMatcher(None, username1, username2).ratio()
                if similarity > 0.6:  # Adjust threshold as needed
                    # Add to score if similar or identical
                    if username1 not in username_scores:
                        username_scores[username1] = {"score": 0, "platforms": set()}
                    if platform1 is not platform2:
                        username_scores[username1]["score"] += similarity
                    username_scores[username1]["platforms"].add(platform2)
                    
                    if username2 not in username_scores:
                        username_scores[username2] = {"score": 0, "platforms": set()}
                    if platform1 is not platform2:
                        username_scores[username2]["score"] += similarity
                    username_scores[username2]["platforms"].add(platform1)

    # Rank usernames by score    
    sorted_usernames = sorted(   
        username_scores.items(),
        key=lambda x: (len(x[1]["platforms"]), x[1]["score"]),
        reverse=True
    )

    # Output the most likely usernames
    return [
        {
            "username": username,
            "score": details["score"],
            "platforms": list(details["platforms"])
        }
        for username, details in sorted_usernames
    ]


def prepare_display_data(instagram_usernames_with_scores, linkedin_usernames_with_scores, twitter_usernames_with_scores, facebook_usernames_with_scores, other_usernames_with_scores):
    """
    Prepare full URLs and profile photos for display in the frontend match cards.
    """
    base_urls = {
        'instagram': 'https://instagram.com/',
        'linkedin': 'https://linkedin.com/in/',
        'twitter': 'https://x.com/',
        'facebook': 'https://facebook.com/'
    }
    print("Processing...1")
    def fetch_profile_photo(url):
        """
        Fetch the profile photo from a URL if possible. Use a placeholder if the request fails.
        """
        print("Processing...1")
        placeholder_image = "https://via.placeholder.com/150"
        try:
            # Simulate fetching a profile picture (Replace with an actual API request if available)
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                # In a real-world scenario, extract the image URL from the response
                print("real")
                return url  # Assume URL is valid for now
        except Exception as e:
            print(f"Error fetching profile photo: {e}")
        print("Processing...")
        print("bs")
        return placeholder_image

    def prepare_entries(usernames_with_scores, platform):

        platform_data = []

        for url, username, score in usernames_with_scores:
            # try:
            #     # Fetch the post data using instascrape
            #     post = Post(url)
            #     headers = {
            #         "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            #     }
            #     post.scrape(headers=headers)

            #     # Use the fetched image URL as the profile_url
            #     profile_url = post.display_url  # This is the image URL
            # except Exception as e:
            #     print(f"Error fetching image URL for {url}: {e}")
            profile_url = url  # Fallback to the original URL if scraping fails

            platform_data.append({
                'platform': platform.capitalize(),
                'username': username,
                'profile_url': profile_url,
                'profile_photo': profile_url,  # Use the same image URL for profile_photo
                'score': score  # Include the score for each username
            })

        return platform_data

    # Prepare display data for each platform

    display_data = []
    print("Processing...2")
    display_data.extend(prepare_entries(instagram_usernames_with_scores, 'instagram'))
    print("Processing...2")
    display_data.extend(prepare_entries(linkedin_usernames_with_scores, 'linkedin'))
    print("Processing...2")
    display_data.extend(prepare_entries(twitter_usernames_with_scores, 'twitter'))
    print("Processing...2")
    display_data.extend(prepare_entries(facebook_usernames_with_scores, 'facebook'))
    print("Processing...2")

    print("Processing...2")

    # Prepare data for other usernames (use URLs directly)
    for other_url, url, score in other_usernames_with_scores:
        print("Processing...3")
        profile_photo = url
        display_data.append({
            'platform': 'Other',
            'username': other_url,
            'profile_url': other_url,
            'profile_photo': profile_photo,
            'score': score  # Include the score for "other" usernames
        })

    return display_data




def is_valid_url(url):
    """
    Validates if the input string is a well-formed URL.
    Args:
        url (str): The URL to validate.
    Returns:
        bool: True if valid, False otherwise.
    """
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False
