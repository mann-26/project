function toggleAnswer(element) {
    element.classList.toggle('open');
}

function searchQuestions() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');
    let found = false;

    faqItems.forEach(item => {
        const questionText = item.querySelector('.question').innerText.toLowerCase();
        const isVisible = questionText.includes(searchInput);
        item.style.display = isVisible ? 'block' : 'none';

        if (isVisible) {
            found = true;
        }
    });

    const notFoundMessage = document.getElementById('notFoundMessage');
    const askQuestionLink = document.getElementById('askQuestionLink');

    if (found) {
        notFoundMessage.style.display = 'none';
        askQuestionLink.style.display = 'none';
    } else {
        notFoundMessage.style.display = 'block';
        askQuestionLink.style.display = 'block';
    }
}