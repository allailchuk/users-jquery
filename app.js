$(document).ready(function () {



    $.ajax({
        type: 'GET',
        url: '/restapi/users',
        dataType: "json",
        cache: false,
        success: function(rsp){
            $.each(rsp.data, function(user){
                addUser(rsp.data[user].id, rsp.data[user].firstname, rsp.data[user].lastname, rsp.data[user].email);
            })
        },
        error: function(){
            alert('error loading users');
        }
    });

    function addUser(id, firstname, lastname, email){
        var $row = $('\
            <tr>\
                <td class="first-name-cell">' + firstname + '</td>\
                <td class="last-name-cell">' + lastname +'</td>\
                <td class="email-cell">' + email +'</td>\
                <td><button class="deleteButton"> Delete </button>\
                    <button class="editButton"> Edit </button>\
                </td>\
            </tr>\
        ').appendTo('#usersTable');
        $row.attr('data-id', id);
        $row.find('.deleteButton').on('click', deleteUser);
        $row.find('.editButton').on('click', editUser);
    }

    function deleteUser(e){
        e.stopPropagation();
        var $row = $(e.target.closest('tr'));
        var id = $row.attr('data-id');
        var conf = confirm("Do you confirm deletion?");
        if (conf){
            $.ajax({
                type: 'DELETE',
                url: '/restapi/users/' + id,
                dataType: "json",
                cache: false,
                success: function(){
                    $row.remove();
                }
            })
        } else {
            alert("You canceled deletion!");
        }
    }

    function editUser(e){
        e.stopPropagation();
        var $row = $(e.target.closest('tr'));
        var id = $row.attr('data-id');
        $('.popup').css('display','block');
        var firstNameValue = $row.find('[class="first-name-cell"]').html();
        var lastNameValue = $row.find('[class="last-name-cell"]').html();
        var emailValue = $row.find('[class="email-cell"]').html();
    
        $('#edit').find('input[name="firstname"]').val(firstNameValue);
        $('#edit').find('input[name="lastname"]').val(lastNameValue);
        $('#edit').find('input[name="email"]').val(emailValue);
        $('#edit').find('input[name="userId"]').val(id);

        $('#edit').find('input.cancel').on('click', function(){
            $('.popup').css('display', 'none');
        })
        $('#edit').find('input.submit').on('click', function(){
            var editFirstName = $('#edit').find('input[name="firstname"]').val();
            var editLastName = $('#edit').find('input[name="lastname"]').val();
            var editEmail = $('#edit').find('input[name="email"]').val();
            var id = $('#edit').find('input[name=userId]').val();
            $.ajax({
                type: 'PUT',
                url: '/restapi/users/' + id,
                data: JSON.stringify({
                    firstname: editFirstName,
                    lastname: editLastName,
                    email: editEmail,
                    id: id
                }),
                dataType: "json",
                cache: false,
                success: function(editedUser){
                    $row.find('.first-name-cell').html(editFirstName);
                    $row.find('.last-name-cell').html(editLastName);
                    $row.find('.email-cell').html(editEmail);
                    $('.popup').css('display', 'none');
                }
            })
        })
    }

    $('#submitButton').on('click', function create(){
        var inputFirstName = $('#newUser').find('input[name="FirstName"]').val();
        var inputLastName = $('#newUser').find('input[name="LastName"]').val();
        var inputEmail = $('#newUser').find('input[name="Email"]').val();
        if (inputFirstName == "" || inputLastName == "" || inputEmail == "") {
            alert("You must fill out the form!")
        } else {
            $.ajax({
                type: 'POST',
                url: '/restapi/users',
                data: JSON.stringify({
                    firstname: inputFirstName,
                    lastname: inputLastName,
                    email: inputEmail
                }),
                dataType: "json",
                cache: false,
                success: function(addedUser){
                    addUser(addedUser.id, addedUser.firstname, addedUser.lastname, addedUser.email);
                    $('#newUser').find('input[name="FirstName"], [name="LastName"], input[name="Email"]').val("");
                }
            })
        }      
    })

})









