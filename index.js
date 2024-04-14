const searchBox = document.getElementById('searchInput');
const darkMode = document.getElementById('imgbtn');

// Event listeners
darkMode.addEventListener('click', myFunction);
searchBox.addEventListener('keyup', getSearchList);

function myFunction() {
    let element = document.body;
    element.classList.toggle("dark-mode");
}

darkMode.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        getSearchList();
    }
});

function getSearchList() {
    const searchInput = document.getElementById('searchInput').value;
    const url = `https://api.edamam.com/search?q=${searchInput}&app_id=3aac1f62&app_key=bf598786847b689e8ea35d0e3c2f245e`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayRecipes(data.hits);
            console.log('fetch successful', data);
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
            // Handle error here (e.g., display error message to user)
        });
}

const FULL_HEART = '♥';
const EMPTY_HEART = '♡';

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeItem = document.createElement('div');
        recipeItem.classList.add('recipe-item');
        

        const recipeTitle = document.createElement('p');
        recipeTitle.textContent = recipe.recipe.label;

        const likeButton = document.createElement('texy');
        likeButton.classList.add('heart');
        likeButton.textContent = EMPTY_HEART;
        likeButton.addEventListener('click', () => handleLike(recipe, likeButton));

        // Create a form for the comment section
        const commentForm = document.createElement('form');
        commentForm.classList.add('comment-form');

        const commentInput = document.createElement('input');
        commentInput.setAttribute('type', 'text');
        commentInput.setAttribute('placeholder', 'Write a comment...'); // Corrected typo here
        commentInput.classList.add('comment-input');

        const commentButton = document.createElement('button');
        commentButton.textContent = 'Post';
        commentButton.classList.add('comment-button');
        commentButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent form submission
            const commentText = commentInput.value;
            handleComment(recipe, commentText); // Call function to handle comment submission
            commentInput.value = ''; // Clear input field after posting comment
        });

        commentForm.appendChild(commentInput);
        commentForm.appendChild(commentButton);

        const recipeInstructions = document.createElement('p');
        recipeInstructions.textContent = recipe.recipe.directions;

        const recipeImage = document.createElement('img');
        recipeImage.classList.add('recipe-image');
        recipeImage.src = recipe.recipe.image;

        const recipeLink = document.createElement('a');
        recipeLink.classList.add('recipe-link');
        recipeLink.href = recipe.recipe.url;
        recipeLink.textContent = 'View Recipe';
        recipeLink.target = '_blank';

        recipeItem.appendChild(recipeTitle);
        recipeItem.appendChild(recipeImage);
        recipeItem.appendChild(likeButton);
        // recipeItem.appendChild(commentForm); // Append comment form to recipe item
        recipeItem.appendChild(recipeInstructions);
        recipeItem.appendChild(recipeLink);

        recipeList.appendChild(recipeItem);
    });
}

function handleComment(recipe, commentText) {
    console.log(`Comment for recipe "${recipe.recipe.label}": ${commentText}`);
}

function handleLike(recipe, likeButton) {
    let likeCount = parseInt(recipe.recipe.likeCount) || 0; // Parse likeCount as integer or default to 0

    if (likeButton.textContent === EMPTY_HEART) {
        likeButton.textContent = FULL_HEART;
        likeButton.classList.add('red-heart');
        likeCount += 1;
    } else {
        likeButton.textContent = EMPTY_HEART;
        likeButton.classList.remove('red-heart'); // Remove red-heart class when unliked
        likeCount -= 1;
    }

    const { label } = recipe.recipe;

    // POST updated like count to server
    fetch('http://localhost:3000/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ label, likeCount })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Like posted successfully!');
    })
    .catch(error => {
        console.error('Error posting like:', error);
        // Handle error here (e.g., display error message to user)
    });
}
