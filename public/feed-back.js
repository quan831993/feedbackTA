let url = "http://localhost:3000/api/v1/feedbacks"
function renderFeedback() {
    try {
        fetch(url)
            .then(res => res.json())
            .then((data) => {
                return data.data;
            })
            .then((data) => {
                console.log(data);
                let listFeetBack = document.getElementsByClassName('listFeedback')[0]
                let html = ''
                for (let i = 0; i < data.length; i++) {
                    html += ` 
                    <div class="comment">
                    <p>${data[i].feedback}</p>
                    <i class="fa-solid fa-x"></i>
                    <i class="fa-solid fa-pen-fancy"></i>
                    <div class="radiusPoint">${data[i].point}</div>
                    </div>
                    `
                }
                listFeetBack.innerHTML= html;
            })
            .then((data)=>{
                let comment = document.querySelectorAll(".comment");
                console.log(comment);
                let delete = document.querySelectorAll(".fa-x");
            })
    } catch (error) {
        console.log(err.message);
    }
}
renderFeedback()