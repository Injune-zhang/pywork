function alertModal(code){
    $('#remodal-text').text(code)
    var inst = $.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')];
    inst.open();
}
