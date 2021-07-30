var computerCategoriesElement = document.getElementById('computer-categories-div');
var computersElement = document.getElementById('computers-div');
var computersLoading = document.getElementById('computers-loading');
var basketComputersCount = document.getElementById('basket-computer-count');
var openBasketButton = document.getElementById('open-basket-button');
var computerModalName = document.getElementById('computer-modal-name');
var computerModalDescription = document.getElementById('computer-modal-description');
var computerModalPrice = document.getElementById('computer-modal-price');
var computerModalPhone = document.getElementById('computer-modal-phone');
var computerModalNew = document.getElementById('computer-modal-isNew');
var computerModalRam = document.getElementById('computer-modal-ram');
var computerModalCpu = document.getElementById('computer-modal-cpu');
var computerModalDrive = document.getElementById('computer-modal-drive');
var computerModalDriveType = document.getElementById('computer-modal-drive-type');
var computerModalOs = document.getElementById('computer-modal-os');
var computerModalVideoCard = document.getElementById('computer-modal-video-card');
var computerDetailsModal = document.getElementById('computer-details-modal');
var computerDetailsModalContent = document.getElementById('computer-details-modal-content');
var basketModalElement = document.getElementById('basket-modal');
var basketModalCloseButton = document.getElementById('basket-modal-close-button');
var basketComputersTableBodyElement = document.getElementById('basket-computers-table-body');
var basketTotalPriceContentElement = document.getElementById('basket-total-price-content');
var confirmOrderModalElement = document.getElementById('confirm-order-modal');
var confirmOrderModalCloseButtonElement = document.getElementById('confirm-order-modal-close-button');
var customerNameElement = document.getElementById('customer-name');
var customerAddressElement = document.getElementById('customer-address');
var customerPhoneElement = document.getElementById('customer-phone');
var customerEmailElement = document.getElementById('customer-email');
var customerOrderNoteElement = document.getElementById('customer-order-note');
var computerSearchInputElement = document.getElementById('computer-search-input');
var computerModalImageContainer = document.getElementById('computer-modal-image-container');
var computersLoadingNext = document.getElementById('computers-loading-next');
var computerCategoriesElementHTML = '';

var users = [];
var categories = [];
var categoriesGlobal = [];
var computers = [];
var computersGlobal = [];
var computersSelectedGlobal = [];
var computersSelectedGlobalForSearch = [];
var basketComputers = [];
var currentSelectedCategoryId = 0;

var allComputersLoaded = false;
var begin = 0;
var length = 25;
var allowScroll = false;

function loadDataFromLocalStorage(){
    var usersString = localStorage.getItem('users');
    var categoriesString = localStorage.getItem('categories');
    var computersString = localStorage.getItem('computers');
    var basketComputersString = localStorage.getItem('basket-computers');

    if(usersString==null){
        localStorage.setItem('users',JSON.stringify(users))
    } else{
        users = JSON.parse(usersString);
    }

    if(categoriesString==null){
        localStorage.setItem('categories',JSON.stringify(categories))
    } else{
        categories = JSON.parse(categoriesString);
        categoriesGlobal = categories.slice();
    }

    if(computersString==null){
        localStorage.setItem('computers',JSON.stringify(computers))
    } else{
        computers = JSON.parse(computersString);
        computersGlobal = categories.slice();
    }

    if(basketComputersString==null){
        localStorage.setItem('basket-computers',JSON.stringify(basketComputers));
    } else {
        basketComputers = JSON.parse(basketComputersString);
    }
}

loadDataFromLocalStorage();

function showBasketComputerCount(){
    basketComputersCount.innerHTML = basketComputers.length;
}

showBasketComputerCount();

function loadComputerCategories(){
    computerCategoriesElementHTML = "<ul class='list-group'>";
    for(let i=0;i<categories.length;i++){
        const c = categories[i];
        computerCategoriesElementHTML += "<li class='list-group-item list-group-item-action' id='computer-category-"+c.id+"' onclick='onCategorySelected("+c.id+")'>"+c.name+"</li>"
    }

    computerCategoriesElementHTML += '</ul>';
    computerCategoriesElement.innerHTML = computerCategoriesElementHTML;
}

loadComputerCategories();

function onCategorySelected(categoryId){
    if(currentSelectedCategoryId === categoryId){

    } else {
        currentSelectedCategoryId = categoryId;
        computersLoading.style.display = 'block';
        computersElement.innerHTML = '';
        computersElement.style.display = 'none';
        begin = 0;
        allComputersLoaded = false;
        allowScroll = true;
        for(let i=0;i<categories.length;i++){
            const c = categories[i];
            if(c.id == categoryId){
                document.getElementById(`computer-category-${c.id}`).style.color = 'blue';
                document.getElementById(`computer-category-${c.id}`).style.fontWeight = 'bold';
            } else{
                document.getElementById(`computer-category-${c.id}`).style.color = 'black';
                document.getElementById(`computer-category-${c.id}`).style.fontWeight = 'normal';
            }
        }
        setTimeout(()=>{
            computersLoading.style.display = 'none';
            var computersSelected = [];
            for(let i=0;i<computers.length;i++){
                const c = computers[i];
                if(c.categoryId === categoryId){
                    computersSelected.push(c);
                }
            }
            for(let i=0;i<computersSelected.length;i++){
                const c = computersSelected[i];
                for(let j=0;j<users.length;j++){
                    const u = users[j];
                    if(u.id === c.userId){
                        c.phone = u.phone;
                        break;
                    }
                }
            }

            computersSelectedGlobal = computersSelected.slice();
            computersSelectedGlobalForSearch = computersSelected.slice();
            computersElementHTML = '';
            if(computersSelected.length <= length){
                allComputersLoaded = true;
            }
            computersSelected = computersSelected.slice(begin,length);
            for (var i = 0; i < computersSelected.length; i++) {
                const c = computersSelected[i];
                computersElementHTML += "<div class='computer-card-container' >" +
                    "<div class='computer-card' >" +
                    "<div class='computer-image' onclick='onComputerSelected(" + c.id + ")' style='background-image:url(" + c.imagePath + ");'></div>" +
                    "<div class='computer-data'><div class='computer-name' title='" +
                    c.name + "'>Ad: " + c.name + "</div>" +
                    "<div class='computer-description' title='" +
                    c.description + "'>Təsvir: " + c.description + "</div>" +
                    "<div class='computer-price' title='" + c.price + " AZN'>Qiymət: " +
                    c.price + " AZN</div>" +
                    "<div class='computer-new'>Yeni: " + (c.isNew ? 'Bəli' : 'Xeyr') + "</div>" +
                    "<div class='user-phone' style='font-size: 15px' title='" + c.phone + "'>Telefon:   " + c.phone + "</div>" +
                    "<div class='add-to-basket-div'><button class='btn btn-primary' " +
                    "onclick='onAddToBasket(" +
                    c.id + ")'>Səbətə at</button></div>" +
                    "</div></div></div>";
            }


            computersElement.innerHTML = computersElementHTML;
            computersElement.style.display = 'block';
            if(computersSelected.length === 0){
                computersElement.innerHTML = "<h2 class='not-found'>Bu kateqoriyada komputer yoxdur!</h2>";
            }
        } ,500);
    }
}

onCategorySelected(1); // show acer computers

function onComputerSelected(computerId){
    computerDetailsModal.style.display = 'block';
    var selectedComputer = null;
    for(let i=0;i<computers.length;i++){
        const c = computers[i];
        if(c.id == computerId){
            selectedComputer = c;
            break;
        }
    }

    computerModalImageContainer.style.backgroundImage = "url('"+selectedComputer.imagePath+"')";
    computerModalName.innerHTML += selectedComputer.name;
    computerModalDescription.innerHTML += selectedComputer.description;
    computerModalPrice.innerHTML += selectedComputer.price;
    computerModalPhone.innerHTML += selectedComputer.phone;
    computerModalNew.innerHTML += (selectedComputer.isNew ? 'Beli' : 'Xeyr');
    computerModalRam.innerHTML += selectedComputer.ram;
    computerModalCpu.innerHTML += selectedComputer.cpu;
    computerModalDrive.innerHTML += selectedComputer.drive;
    computerModalDriveType.innerHTML += selectedComputer.driveType == 'hdd' ? 'HDD' : 'SSD';
    computerModalOs.innerHTML += selectedComputer.os;
}

window.addEventListener('click',function(){
    if(event.target === computerDetailsModal){
        computerDetailsModal.style.display = 'none';
    }
});

function onAddToBasket(computerId){
    openBasketButton.style.display = 'none';
    setTimeout(()=>{
        openBasketButton.style.display = 'inline-block';
        var existsInBasket = false;
        for(let i=0;i<basketComputers.length;i++){
            const b = basketComputers[i];
            if(b.computer.id === computerId){
                b.count++;
                existsInBasket = true;
                break;
            }
        }

        if(existsInBasket){

        } else{
            var selectedComputer = null;
            for(let i=0;i<computers.length;i++){
                const c = computers[i];
                if(c.id === computerId){
                    selectedComputer = c;
                    break;
                }
            }
            basketComputers.push({count: 1, computer: selectedComputer});
        }

        showBasketComputerCount();
        saveBasketComputersToLocalStorage();
    } ,200);
}

function saveBasketComputersToLocalStorage(){
    localStorage.setItem('basket-computers',JSON.stringify(basketComputers));
}

function refreshComputersBasket() {
    basketComputersTableBodyElement.innerHTML = '';
    basketComputersTableBodyElementHtml = '';
    for (let index = 0; index < basketComputers.length; index++) {
        const b = basketComputers[index];
        basketComputersTableBodyElementHtml += '<tr><td>' + b.computer.id;
        basketComputersTableBodyElementHtml += '</td><td><img class="basket-computer-image" src="' +
            b.computer.imagePath + '"/>';
        basketComputersTableBodyElementHtml += '</td><td>' + b.computer.name;
        basketComputersTableBodyElementHtml += '</td><td>' + b.computer.price;
        basketComputersTableBodyElementHtml += ' AZN</td><td><input min="1" max="10000" type="number" value="' +
            b.count + '" ' +
            ' onchange="computerCountChanged(this,' + b.computer.id + ')" onkeypress="checkCount(event)" />';
        basketComputersTableBodyElementHtml += '</td><td id="computer-total-price-' +
            b.computer.id + '">' + (b.computer.price * b.count);
        basketComputersTableBodyElementHtml += ' AZN</td><td><button onclick="deleteBasketComputer(' +
            b.computer.id +
            ')" class="btn btn-danger">Sil</button></td><tr>';
    }
    basketComputersTableBodyElement.innerHTML = basketComputersTableBodyElementHtml;
}

function calculateBasketTotalPrice(){
    var totalPrice = 0;
    for(let i=0;i<basketComputers.length;i++){
        const b = basketComputers[i];
        totalPrice+=b.count * b.computer.price;
    }
    basketTotalPriceContentElement.innerHTML = totalPrice;
}

calculateBasketTotalPrice();

function onOpenBasket(){
    if(basketComputers.length===0){
        showAlertMessage('Sebet bosdur!',1000)
    } else{
        basketModalElement.style.display = 'block';
        refreshComputersBasket();
        calculateBasketTotalPrice();
    }
}

basketModalCloseButton.addEventListener('click',function(){
    closeBasket();

});

function closeBasket(){
    setTimeout(()=>{
        basketModalElement.style.display = 'none';
    },200)
}

function showAlertMessage(message, duration){
    var messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('alert-message');

    var fixedElements = document.getElementById('fixed-elements');
    fixedElements.appendChild(messageElement);
    messageElement.style.display = 'block';
    setTimeout(()=>{
        messageElement.style.display = 'none';
        messageElement.remove();
    } ,duration)
};

function computerCountChanged(countInput,computerId){
    if(countInput.value == '' || countInput.value == '0'){
        countInput.value = '1';
    }

    for(let i=0;i<basketComputers.length;i++){
        const b = basketComputers[i];
        if(b.computer.id === computerId){
            b.count = Number(countInput.value);
            document.getElementById('computer-total-price-'+b.computer.id).innerHTML = '' + (b.count * b.computer.price)+ 'AZN';
            break;
        }
    }
    localStorage.setItem('basket-computers',JSON.stringify(basketComputers));
    calculateBasketTotalPrice();
}

function deleteBasketComputer(computerId){
    for(let i = 0;i<basketComputers.length;i++){
        const b = basketComputers[i];
        if(b.computer.id === computerId){
            basketComputers.splice(i,1);
            break;
        }
    }

    refreshComputersBasket();
    localStorage.setItem('basket-computers',JSON.stringify(basketComputers));
    calculateBasketTotalPrice();
    hideAndShowBasketButton();
    if(basketComputers.length === 0){
        closeBasket();
    }
}

function hideAndShowBasketButton(){
    openBasketButton.style.display = 'none';
    setTimeout(()=>{
        openBasketButton.style.display = 'block';
        showBasketComputerCount();
    } ,200)
}