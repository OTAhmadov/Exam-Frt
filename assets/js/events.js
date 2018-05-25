/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    var chosenLang;

    if (document.cookie.indexOf('lang') == -1) {
        chosenLang = Exam.lang;
    }

    else {
        chosenLang = Exam.getCookie('lang');
    }

    $('.language-buttons a').each(function () {
        if ($(this).attr('id') == chosenLang) {
            $(this).parent('li').prependTo($('.language-buttons ul'));

        }
    });

    $('body').on('click', '.hide-menu', function () {
        $('.app-list').stop().slideToggle();
    });

    $('.main-content').on('click', '.language-buttons a', function (e) {
        try {
            e.preventDefault();
            var lang = $(this).attr('id');

            if (lang != 'en' && lang != 'ru') {
                lang = 'az';
            }

            $('.language-buttons a').each(function () {
                $(this).removeAttr('data-chosen');
            });

            document.cookie = "lang=" + lang;
            window.location.reload();
        }
        catch (err) {
            console.error(err);
        }

    });

    if (Exam.token == '0') {
        Exam.initToken('tk');
    }


    Exam.loadLanguagePack('az');
    Exam.loadLanguagePack('en');
    Exam.loadLanguagePack('ru');

    setTimeout(function () {
        Exam.i18n();
        $.fn.datepicker.defaults.language = Exam.lang;
        $.extend(jconfirm.pluginDefaults, {
            confirmButton: Exam.dictionary[Exam.lang]['ok'],
            cancelButton: Exam.dictionary[Exam.lang]['close'],
            title: Exam.dictionary[Exam.lang]['warning']
        });
    }, 1000)



    $('#logoutForm').attr("action", Exam.urls.ROS + "logout");
    $('#logoutForm input[name="token"]').val(Exam.token);

    Exam.Proxy.getProfile();

    Exam.Proxy.loadApplications();
    
    $('.get_notification_page').attr('href', Exam.urls.NOTIFICATION  + Exam.token);
    

    Exam.Proxy.loadModules(function (modules) {
        $('ul.module .mod-con').prepend(Exam.Service.parseModules(modules));
        $('.module-list').html(Exam.Service.parseModules(modules));
        var currModule = Exam.initCurrentModule('currModule');
        if (localStorage.button != undefined) {
            Exam.Service[localStorage.button]();
            localStorage.removeItem('button');

        }
        else {
            if (currModule != "") {
                Exam.currModule = currModule;
                var module = $('ul.module-list').find('.module-block[data-id="' + Exam.currModule + '"] a');

                if (module.length) {
                    module.click();
                } else {
                    $('ul.module-list').find('.module-block a').eq(0).click();
                }
            }
            else {
                $('ul.module-list').find('.module-block a').eq(0).click();
            }
        }


    });



    $('ul.module-list').on('click', '.module-block a', function (e) {
        NProgress.done();
        NProgress.remove();
        var obj = $(this).parents('li');
        var title = obj.attr('title');
        var id = obj.attr('data-id');
        var code = obj.attr('data-code');
        // $('.module-list').find('.sub-module-con').fadeOut(1);
        $('ul.module-list').find('li').removeClass('active');
        // $(this).parents('li').find('.sub-module-con').fadeIn();
        // $('.module-list').find('.sub-module-con').remove();
        $(this).parents('li').addClass('active');
        try {

            if (obj.attr('data-check') !== '1') {
                NProgress.start();
                Exam.currModule = obj.attr('data-id');
                document.cookie = "currModule=" + Exam.currModule;


                $('.main-content-upd').load('partials/module_' + id + '.html?' + Math.random(), function () {
                    $('#main-div #buttons_div').attr('title', 'Ümumi əməliyyatlar');
                    history.pushState({page: code}, null, '#' + title);
                    $('ul.module-list').find('li').removeAttr('data-check');
                    obj.attr('data-check', 1);

                });
            } else {
                return false
            }

        }

        catch (err) {
            console.error(err);
        }
    });
    
    
    $('body').on('click','#operation_1001390',function() {
            try {
//                var id =  $('body').attr('data-id')
//                Exam.Proxy.getQuestionDetails(id, function (callback) {
//                    var data = callback.data
//                    if (data) {
//                    $('body').find('#quest_type').find('option[value="' + data.subject.id + '"]').prop('selected', true);
//                }
//            })
                $('body .add-new .search-scroll').load('partials/question_edit.html');
                $('body').find('.add-new').css('right', '0');
                
            }
            catch(err) {
                console.error(err);
            }
        });
        
    $('body').on('click', '#operation_1001389 ', function (e) {
        try {
            var questionId = $('body').attr('data-id');
            $.confirm({
                title: Exam.dictionary[Exam.lang]['warning'],
                content: Exam.dictionary[Exam.lang]['delete_info'],
                confirm: function () {
                    Exam.Proxy.removeQuestion(questionId, function () {
                        Exam.Proxy.loadQuestions();
                        $('body').find('.col-sm-4.info').fadeOut();
                        $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
                        })
                    },
                theme: 'black'
            });
        } catch (e) {
            console.error(e)
        }

    });
    
    $('body').on('click', '#question_list tbody tr', function (e) {
        try {
            var questionId = $(this).attr('data-id')
//            var content = $(this).attr('question-content');
            $('body').attr('data-id', questionId)
//            $('#question_content').html(content);
            Exam.Proxy.getQuestionDetails(questionId, function (data) {
                if (data) {
                    $('#question_content').html(data.content);
//                    <img src="+ data.+">
                }

            })
            
            $('.type_2_btns').html(Exam.Service.parseOperations(Exam.operationList, '2'));
            $('body').find('.col-sm-12.data').removeClass('col-sm-12').addClass('col-sm-8');
            $('body').find('.col-sm-4.info').fadeIn(1).css('right', '0');
            
            $('body').find('#question_list tr').removeClass('active');
            $(this).addClass('active')
        }
        catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '.panel-close', function () {
        $('body').find('.col-sm-4.info').fadeOut();
        $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
    });

    $('#main-div').on('click', '.btn-load-more', function (e) {
        try {
            var typeTable = $(this).attr('data-table');
            var $btn = $(this);
            var type = $btn.attr('data-page');
            var page = parseInt(type ? type : '2');
            var questParams = $('#main-div .question-search-form').serialize();

            $btn.prop('disabled', true);
            if (typeTable == 'questions') {
                Exam.Proxy.loadQuestions(page, questParams, function (data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    if (!data) {
                        $btn.remove();
                    }
                });
            }

        }
        catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '.dropdown-filter a', function (e) {
        try {
            var text = $(this).text();
            $(this).parents('.btn-group').find('button span').text(text);
        }
        catch (err) {
            console.error(err);
        }
    });
    
     $('body').on('click', '#back', function(e) {
      $('body').find('.add-new').css('right', '-100%');

       return false
   });
   
   $('#main-div').on('click', '#question_add', function (e) {
            try {
                if (Exam.Validation.validateRequiredFields('data-required')) {
                    var allValid = true;
                    var formData = new FormData();
                    if (CKEDITOR.instances.quest_content.getData()) {
                        var question = {
                        subjectId: $('#quest_subject').val(),
                        eduPlanId: $('#edu_plan').val(),
                        eduLevelId: $('#quest_edu_level').val(),
                        questionLevelId: $('#quest_level').val(),
                        questionTypeId: $('#quest_type').val(),
                        topicId: $('#quest_topic').val(),
                        langId: $('#quest_lang').val(),
                        tipiId: $('#quest_tipi').val(),
                        content: CKEDITOR.instances.quest_content.getData(),
                        variants: [],
                        token: Exam.token
                    }
                }else{
                    $.notify('Sual məzmununu əlavə edin', {
                    type: 'warning'
                });
                return false;
                }
                    

                    var questionTypeCode = $('#quest_type').find('option:selected').attr('code');
                    if (questionTypeCode != undefined && questionTypeCode != "OPEN_QUEST") {
                        if (Exam.Validation.validateRequiredFields('variant-required')) {
                            var inputType = $(".answer:input").attr('type');
                            var checkedCount = $(".answer:input:checked").length;
                            if (inputType == "radio") {
                                if (checkedCount == 0) {
                                    $.alert({
                                        title: Exam.dictionary[Exam.lang]['warning'],
                                        content: Exam.dictionary[Exam.lang]['select_one'],
                                        theme: 'material'
                                    });
                                    allValid = false;
                                }
                            }
                            else if (inputType == "checkbox") {
                                if (checkedCount <= 1) {
                                    $.alert({
                                        title: Exam.dictionary[Exam.lang]['warning'],
                                        content: Exam.dictionary[Exam.lang]['select_two'],
                                        theme: 'material'
                                    });
                                    allValid = false;
                                }
                            }

                            var wrongFiles = ''
                            $('.variant-item').each(function (i, v) {
                                var variant = {
                                    id: (++i),
                                    content: $(this).find('textarea').val(),
                                    rightChoise: $(this).find('.answer').is(':checked') ? true : false
                                }
                                question.variants.push(variant);
                                
                                if ($(this).find('.variant_file')[0].files[0]) { 
                                    var file = $(this).find('.variant_file')[0].files[0];
                                    console.log(file);
                                    console.log('--');
                                    if (Exam.Validation.checkFile(file.type, fileTypes.IMAGE_CONTENT_TYPE)) {
                                        if (file.size > 5 * 1024 * 1024) {
                                            $.notify(file.name + Exam.dictionary[Exam.lang]['exceed_volume'], {
                                                type: 'warning'
                                            });
                                            allValid = false;
                                        }
                                        else {
                                            formData.append('file_' + i, file);
                                        }
                                    }
                                    else {
                                        wrongFiles += wrongFiles != '' ? ', ' + file.name : file.name;

                                    }
                                }
                            });

                            if (wrongFiles != '') {
                                $.notify(Exam.dictionary[Exam.lang]['wrong_format'] + wrongFiles, {
                                    type: 'warning'
                                });
                                allValid = false;
                            }

                        } else {
                            allValid = false;
                        }
                    }

                    formData.append('question', new Blob([JSON.stringify(question)], {
                        type: "application/json"

                    }));

                    if ($('#quest_file')[0].files[0]) {
                        var image = $('#quest_file')[0].files[0];
                        if (Exam.Validation.checkFile(image.type, fileTypes.IMAGE_CONTENT_TYPE)) {
                            formData.append('file', image);
                        }
                        else {
                            $.notify(Exam.dictionary[Exam.lang]['wrong_format'] + image.name, {
                                type: 'warning'
                            });

                            allValid = false;
                        }
                    }

                    if (allValid) {
                        Exam.Proxy.addQuestion(formData, function () {
                            var params = $('.question-search-form').serialize();
                            $('body').find('.add-new').css('right', '-100%');
                            Exam.Proxy.loadQuestions('', params);
                        });
                    }
                }
            }
            catch (err) {
                console.error(err);
            }
        });

    $(window).resize(function () {
        var width = window.innerWidth;
        if(width > 1500) {
            $('.app-list').show();
        } else {
            $(document).on('click','.hide-menu',function(e){
                e.stopPropagation();
                var display = $(".app-list").css('display');
                if(display === "none") {
                    $('.app-list').fadeIn();
                } else{
                    $('.app-list').fadeOut();
                }
            });

            $("body").on("click",function() {
                $('.app-list').hide();
            });
        }
    });



        $('#main-div').on('click', '#question_edit', function (e) {
            try {
                if (Exam.Validation.validateRequiredFields('data-required')) {
                    var allValid = true;
                    var formData = new FormData();
                    var questionId = $('body').attr('data-id');
                    var question = {
                        subjectId: $('#quest_subject').val(),
                        eduPlanId: $('#edu_plan').val(),
                        eduLevelId: $('#quest_edu_level').val(),
                        questionLevelId: $('#quest_level').val(),
                        questionTypeId: $('#quest_type').val(),
                        topicId: $('#quest_topic').val(),
                        langId: $('#quest_lang').val(),
                        tipiId: $('#quest_tipi').val(),
                        content: CKEDITOR.instances.quest_content.getData(),
                        variants: [],
                        token: Exam.token
                    }
                    
                    var questionTypeCode = $('#quest_type').find('option:selected').attr('code');
                    if (questionTypeCode != undefined && questionTypeCode != "OPEN_QUEST") {
                        if (Exam.Validation.validateRequiredFields('variant-required')) {
                            var inputType = $(".answer:input").attr('type');
                            var checkedCount = $(".answer:input:checked").length;
                            if (inputType == "radio") {
                                if (checkedCount == 0) {
                                    $.alert({
                                        title: Exam.dictionary[Exam.lang]['warning'],
                                        content: Exam.dictionary[Exam.lang]['select_one'],
                                        theme: 'material'
                                    });
                                    allValid = false;
                                }
                            }
                            else if (inputType == "checkbox") {
                                if (checkedCount <= 1) {
                                    $.alert({
                                        title: Exam.dictionary[Exam.lang]['warning'],
                                        content: Exam.dictionary[Exam.lang]['select_two'],
                                        theme: 'material'
                                    });
                                    allValid = false;
                                }
                            }

                            $('.variant-item').each(function (i, v) {
                                var variant = {
                                    id: $(this).find('textarea').attr('data-id'),
                                    content: $(this).find('textarea').val(),
                                    rightChoise: $(this).find('.answer').is(':checked') ? true : false
                                }
                                question.variants.push(variant);
                                
                            });

                        } else {
                            allValid = false;
                        }
                    }

                    formData.append('question', new Blob([JSON.stringify(question)], {
                        type: "application/json"

                    }));
                    
                    if (allValid) {
                        Exam.Proxy.updateQuestion(questionId, formData, function (data) {
                            if(data) {
                                 var params = $('.question-search-form').serialize();
                                $('body').find('.add-new').css('right', '-100%');
                                Exam.Proxy.loadQuestions('', params);
                            }
                           
                        });
                    }
                }
            }
            catch (err) {
                console.error(err);
            }
        });
        
        $('body').on('click', '.qimage', function (e) {
            
            var path = $(this).parents('div.for-path').attr('data-path');
            $.confirm({
            title: Exam.dictionary[Exam.lang]['warning'],
            content: Exam.dictionary[Exam.lang]['delete_info'],
            confirm: function () {
                Exam.Proxy.removeFile(path);
                $(this).find('.quest_file').val('');
                $(this).find('.quest_pic').attr('src', '');
                $(this).addClass('hidden');
                $(this).find('.quest-pic-img').removeClass('hidden');
                
            },
            theme: 'black'
        });
        
        return false;
    });
    
        $('body').on('change', '.quest-pic-img', function () {
        

    });
    
});

    function ckeditors(editorName) {
        CKEDITOR.replace(editorName, { language: 'az'});
    }

    function setCkeditor() {
        if($(".custom-ckeditor").length > 0) {
            $(".custom-ckeditor").each(function () {
                var id = $(this).attr("id");
                ckeditors(id);
            });
        }
    }