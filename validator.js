
function Validator(formSelector){
    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;

        }

    }
    var formRules = {};

    var validatorRules = {
        required: function(value){
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function(value){
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email';
        },
        min: function(min){
            return function(value){
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} ký tự`;
            }
            
        }
    }
    var ruleName = 'required';
    console.log(validatorRules[ruleName])


    var formElement = document.querySelector(formSelector);
    if(formElement){
        var inputs = formElement.querySelectorAll('[name][rules]')
        for (let input of inputs){

            var rules = input.getAttribute('rules').split('|')
            for(var rule of rules){

                var ruleInfo;
                var isRuleHasValue = rule.includes(':');
                if(isRuleHasValue){
                    ruleInfo = rule.split(':')
                    rule = ruleInfo[0];
                }
                var ruleFunc = validatorRules[rule];
                if(isRuleHasValue){
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }
                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc);
                }else{
                    formRules[input.name] = [ruleFunc];
                }

            }
            // lắng nghe sự kiện để validata(blur,chang...)
            input.onblur = handleValidate;
            input.oninput = handleClearError;
    }
    function handleValidate(event){
        var rules = formRules[event.target.name];
        var erroMessage;
        rules.find(function(rule){
            erroMessage =  rule(event.target.value);
            return erroMessage;
        })
        if(erroMessage){
            
            var formGroup = getParent(event.target,'.form-group');
            if(formGroup){
                formGroup.classList.add('invalid');
                var formMessage = formGroup.querySelector('.form-message');
                if(formMessage){
                    formMessage.innerText = erroMessage;
                }

            }
        }
        return !erroMessage;
    }
    function handleClearError(event){
        var formGroup = getParent(event.target,'.form-group');
        if(formGroup.classList.contains('invalid')){
            formGroup.classList.remove('invalid');
            var formMessage = formGroup.querySelector('.form-message');
                if(formMessage){
                    formMessage.innerText = '';
                }
        }

    }
  
}

// Xử lý hành vi summit form
formElement.onsubmit = function(event){
    event.preventDefault();
    var inputs = formElement.querySelectorAll('[name][rules]');
    var isValid = true;
        for (let input of inputs){
            if(!handleValidate({target: input})){
                isValid = false;
            }
        }
        if(isValid){
            formElement.submit();
        }
}


}