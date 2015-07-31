function Card(suit, val, point) {
    this.suit = suit;
    this.val = val;
    this.point = point;
}

Card.suit = ['Hearts', 'Spades', 'Diamonds', 'Clubs'];
Card.val = [7,8,'Queen','King',10,'Ace',9,'Jack'];
Card.point = [{7: 0},{8: 0},{'Queen': 0},{'King': 0},{10: 1},{'Ace': 1},{9: 2},{'Jack': 3}];
Card.prototype.toString = function(){
    if(this.val === -1){
        return this.suit;
    }else return Card.val[this.val] + ' of ' + Card.suit[this.suit] + ' with point ' + Card.point[this.val][Card.val[this.val]];
};
function Deck(){
    var cards = [];
    for(var i = 0;i< 4; i++){
        for(var j = 0; j< 8;j++){
            cards.push(new Card(i,j));
        }
    }
    this.cards = cards;
}
Deck.prototype.toString = function (){
    return this.cards.map(function (card){
        return card.toString();
    });
};

Deck.prototype.shuffle = function(){
    var random = 0,temp;
    for(var i = 0;i < 32;i++){
        random = Math.floor(Math.random() * (this.cards.length - 1));
        temp = this.cards[i];
        this.cards[i] = this.cards[random];
        this.cards[random] = temp;
    }
};

var players = [];
Deck.prototype.deal = function () {
    for(var i = 0; i < 4;i++) {
        players[i] = new Player(i + 1);
    }
    var d = new Deck();
    d.shuffle();
    var arr = d.toString();

    while(arr.length !== 0){
        for(var j = 0; j< players.length;j++){
            players[j].deck.push(arr.pop());
        }
    }
    //console.log(players);
};


function Player(id) {
    this.id = id;
    this.deck = [];
    this.bid = 0;
    this.score = 0;
    this.bidPass = false;
    this.bidWon = false;
}
Player.prototype.toString = function () {
    return 'PLAYER ' + this.id + '<br><br>' + this.deck.toString().split(',').join('<br>');
};

var Bidders = function(bidder1,bidder2) {
    this.bidders = [bidder1,bidder2];
    this.amount = [0,0];
};

var bidder;
document.addEventListener('DOMContentLoaded', function (){
    var btn = document.querySelector('button');
    btn.addEventListener('click', function (){
        var d = new Deck();
        d.deal();
        players.forEach(function (p) {
            var div = createDiv(p.id);
            div.innerHTML = p.toString();
        });
        bidder = new Bidders('Player1','Player2');
        //console.log(bidder);
        btn.style.display = 'none';
    });

});

function createDiv(id) {
    var outerDiv = createElement('div',document.body,'outer Player'+ id);
    var div = createElement('div',outerDiv,'square');
    var input = createElement('input',outerDiv,'bidBox','',{'type': 'number','placeholder': 'bid for power suit'}); //'min': '16','max': '28'
    var bid = createElement('input',outerDiv,'bidBtn','Bid',{'type': 'submit', 'value': 'Bid'});
    var pass = createElement('input',outerDiv,'passBtn','Bid',{'type': 'submit', 'value': 'Pass'});
    if(id !== 1) {
        input.setAttribute('disabled',true);
        bid.setAttribute('disabled',true);
        pass.setAttribute('disabled',true);
    }


    bid.addEventListener('click', function () {
        players[id-1].bid = bid.previousElementSibling.value;
        bidder.amount[bidder.bidders.indexOf('Player'+(id))] = bid.previousElementSibling.value;
        console.log(bidder);

        bid.setAttribute('disabled',true);
        pass.setAttribute('disabled',true);
        input.setAttribute('disabled',true);
        input.classList.remove('latest');

        var next;
        if(bid.parentNode.classList.contains(bidder.bidders[0])) {
            next = document.querySelector('.'+bidder.bidders[1]);
        }else{
            next = document.querySelector('.'+bidder.bidders[0]);
        }
        //console.log(next);
        next.children[1].removeAttribute('disabled');
        next.children[1].classList.add('latest');
        next.children[2].removeAttribute('disabled');
        next.children[3].removeAttribute('disabled');
    });

    pass.addEventListener('click', function () {
        players[id-1].bidPass = true;
        players[id-1].amount = 0;
        console.log(players);

        bid.setAttribute('disabled',true);
        pass.setAttribute('disabled',true);
        input.setAttribute('disabled',true);
        input.classList.remove('latest');
        var remove = bidder.bidders.indexOf('Player'+(id));
        bidder.bidders.splice(remove,1);
        bidder.amount.splice(remove,1);

        var add = getNextPlayer(id);
        //console.log(add);

        if(add !== 0) {
            bidder.bidders.push('Player' + add);
            bidder.amount.push(0);
        }
        console.log(bidder.bidders);

        if(bidder.bidders.length === 2) {
            var next = document.querySelector('.' + bidder.bidders[0]);
            next.children[1].removeAttribute('disabled');
            next.children[1].classList.add('latest');
            next.children[2].removeAttribute('disabled');
            next.children[3].removeAttribute('disabled');
        }else{
            console.log(bidder.bidders);
            var winner = document.querySelector('.'+bidder.bidders[0]);
            console.log(bidder);
            if(bidder.amount[0] !== 0) {
                winner.innerHTML += '<br><br>' + '<span id="winner">Won the bidding!!</span>';
            }else{
                var divs = document.querySelectorAll('div.outer');
                Array.prototype.forEach.call(divs,function (d) {
                    d.remove();
                });
                alert('The game is abandoned! Start a new one!');
                var startBtn = document.querySelector('button#deal');
                startBtn.style.display = 'block';
            }
        }

        function getNextPlayer(p) {
            if(p < 4) {
                if (players[p].bidPass === true) return getNextPlayer(p + 1);
                else {
                    if (bidder.bidders.indexOf('Player' + players[p].id) === -1) return players[p].id;
                    else return getNextPlayer(p + 1);
                }
            }else return 0;
        }
    });

    return div;
}

function createElement(elementType, parent, className, innerHTML, custom) {
    var element = document.createElement(elementType);
    if (parent) parent.appendChild(element);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    if (typeof custom !== 'undefined') {
        for (var prop in custom) {
            element.setAttribute(prop, custom[prop]);
        }
    }
    return element;
}