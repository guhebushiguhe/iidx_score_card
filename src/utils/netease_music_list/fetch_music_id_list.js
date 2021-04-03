var jq = document.createElement('script');
jq.src = "https://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

var idList = []
$('.m-table').find('tr').each(function(index,item){
    if(index==0)return
    var id = $(this).children('td').eq(1).find('a').attr('href').split('?')[1].split('=')[1]
    var title = $(this).children('td').eq(1).find('a').children('b').attr('title')
    var artist = $(this).children('td').eq(3).find('.text').attr('title')
    idList.push({
        id,
        title,
        artist
    })
})
idList

