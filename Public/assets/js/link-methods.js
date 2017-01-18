$(document).ready(function() {

// Add click handler to hyperlinks to send restful DELETE requests
//
// Example:
//
// <a href="/delete/1" class="rest-delete">delete</a>
// <script>restful.init($('.rest-delete'));</script>
//
var restful = {

// TODO: add various configurations, e.g.
// - do_confirm: [ true | false ]
// - confirm_message: "Are you sure?"
// - do_remove_parent: [ true | false ]
// - parent_selector: '.li' '.div' ...
// - success: (closure)

init: function(elem) {
elem.on('click', function(e) {
self=$(this);
e.preventDefault();

if(confirm('Are you sure?')) {
$.ajax({
url: self.attr('href'),
method: 'DELETE',
success: function(data) {
$('body').append('<script>' + data + '</script>');
},
error: function(data) {
alert("Error while deleting.");
console.log(data);
}
});
};
})
},
}

restful.init($('.rest-delete'));
});
