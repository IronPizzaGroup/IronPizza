$(document).ready(function() {
    pizzaPage.init();
})

var pizzaPage = {
    url: "/pizza",
    pizzaArr: [],
    init: function() {
        pizzaPage.events();
        pizzaPage.styling();
    },
    styling: function() {
        pizzaPage.readPizza();
    },


    events: function() {
        $('#order').on("click", "submit", function(event) {
            event.preventDefault();
            console.log("click");
            $('.order-group input[name="order-list"]').val($('input[name="order"]').val());
            $('input[name="order"]').val("");
        })

        $(".order-group").on('submit', function(event) {
            event.preventDefault();
            console.log("click");
            var pizzaToSave = {

                    name: $('.order-group input[name="order-list"]').val(),
                    size: $('input[name="size-list"]').val(),
                    crust: $('input[name="crust-list"]').val(),
                    sauce: $('input[name="sauce-list"]').val(),
                    topping: [$('input[name="topping1-list"]').val(),$('input[name="topping2-list"]').val(),$('input[name="topping3-list"]').val(),],
                    // topping2: $('input[name="topping2-list"]').val(),
                    // topping3: $('input[name="topping3-list"]').val(),
                }
                // debugger

            console.log(pizzaToSave);
//            pizzaPage.createPizza(pizzaToSave);
             pizzaPage.createPizza(JSON.stringify(pizzaToSave));

            $('input').val("");
        })
        //delete pizza
        $("#cancel").on("click", function(event){
          event.preventDefault();
          var pizzaID = $(this).children().data('id');
          console.log(this,pizzaID);
          pizzaPage.deletePizza(pizzaID);
        });

    },


    createPizza: function(pizzaToSave) {
        $.ajax({
             contentType: "application/json; charset=utf-8",
            url: pizzaPage.url,
            method: 'POST',
            data: pizzaToSave,
            success: function(data) {
                console.log("yes! created", data);
                pizzaPage.readPizza();
            },
            error: function() {
                console.error("create error", err);
            }
        })
    },

    readPizza: function() {
        $.ajax({
            url: pizzaPage.url,
            method: 'GET',
            success: function(data) {
                data = JSON.parse(data);
                console.log("yes! read", data);
                // data = JSON.parse(data);
                $('#cancel').html("");
                data.forEach(function(element, idx) {
                    var pizzaHtmlStr = pizzaPage.htmlGenerator(pizzaTmpls.myPizza, element)
                    $('#cancel').append(pizzaHtmlStr);
                    pizzaPage.pizzaArr.push(data);

                });

            },
            error: function() {
                console.error("read error", err);
            }
        })
    },

    updatePizza: function(pizzaArr) {
        $.ajax({
            url: pizzaPage.url,
            method: 'PUT',
            data: pizzaArr,
            success: function(data) {
                console.log("yes! update", data);
                pizzaPage.readPizza();

            },
            error: function() {
                console.error("update error", err);
            }
        })
    },

    deletePizza: function(pizzaID) {
        var deleteOrder = pizzaPage.url +'/'+pizzaID;
        $.ajax({
            url: deleteOrder,
            method: 'DELETE',
            success: function() {
                console.log("yes! deleted" );
                console.log(deleteOrder);
                pizzaPage.readPizza();
            },
            error: function() {
                console.error("delete error", err);
            }
        })
    },
    templification: function(template) {
        return _.template(template);
    },

    htmlGenerator: function(template, data) {
        var tmpl = pizzaPage.templification(template);
        return tmpl(data);
    },


};
