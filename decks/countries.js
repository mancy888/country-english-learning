/* ===================================================================
 * 词库包：世界地理（国家 / 首都）
 * 字段：国家英文, 国家中文, 国家音标, iso(小写), 国家中心纬, 国家中心经, 地图名,
 *       首都英文, 首都中文, 首都音标, 首都纬, 首都经
 * =================================================================== */
(function () {
  const RAW = [
    ["China","中国","ˈtʃaɪnə","cn",35.0,103.0,"China","Beijing","北京","beɪˈdʒɪŋ",39.90,116.41],
    ["United States","美国","juˈnaɪtɪd ˈsteɪts","us",39.8,-98.6,"United States of America","Washington","华盛顿","ˈwɒʃɪŋtən",38.90,-77.04],
    ["United Kingdom","英国","juˈnaɪtɪd ˈkɪŋdəm","gb",54.0,-2.0,"United Kingdom","London","伦敦","ˈlʌndən",51.51,-0.13],
    ["Japan","日本","dʒəˈpæn","jp",36.2,138.3,"Japan","Tokyo","东京","ˈtoʊkioʊ",35.68,139.69],
    ["South Korea","韩国","saʊθ kəˈriə","kr",36.5,127.8,"South Korea","Seoul","首尔","soʊl",37.57,126.98],
    ["France","法国","frɑːns","fr",46.6,2.2,"France","Paris","巴黎","ˈpærɪs",48.86,2.35],
    ["Germany","德国","ˈdʒɜːrməni","de",51.2,10.5,"Germany","Berlin","柏林","bɜːrˈlɪn",52.52,13.40],
    ["Italy","意大利","ˈɪtəli","it",41.9,12.6,"Italy","Rome","罗马","roʊm",41.90,12.50],
    ["Spain","西班牙","speɪn","es",40.0,-3.7,"Spain","Madrid","马德里","məˈdrɪd",40.42,-3.70],
    ["Canada","加拿大","ˈkænədə","ca",56.1,-106.3,"Canada","Ottawa","渥太华","ˈɒtəwə",45.42,-75.70],
    ["Australia","澳大利亚","ɒˈstreɪliə","au",-25.3,133.8,"Australia","Canberra","堪培拉","ˈkænbərə",-35.28,149.13],
    ["Brazil","巴西","brəˈzɪl","br",-14.2,-51.9,"Brazil","Brasília","巴西利亚","brəˈzɪliə",-15.79,-47.88],
    ["India","印度","ˈɪndiə","in",22.0,79.0,"India","New Delhi","新德里","njuː ˈdeli",28.61,77.21],
    ["Russia","俄罗斯","ˈrʌʃə","ru",61.5,105.3,"Russia","Moscow","莫斯科","ˈmɒskoʊ",55.75,37.62],
    ["Mexico","墨西哥","ˈmeksɪkoʊ","mx",23.6,-102.5,"Mexico","Mexico City","墨西哥城","ˈmeksɪkoʊ ˈsɪti",19.43,-99.13],
    ["Egypt","埃及","ˈiːdʒɪpt","eg",26.8,30.8,"Egypt","Cairo","开罗","ˈkaɪroʊ",30.04,31.24],
    ["Thailand","泰国","ˈtaɪlænd","th",15.9,100.99,"Thailand","Bangkok","曼谷","ˈbæŋkɒk",13.76,100.50],
    ["Singapore","新加坡","ˈsɪŋəpɔːr","sg",1.35,103.8,"Singapore","Singapore","新加坡","ˈsɪŋəpɔːr",1.35,103.82],
    ["Vietnam","越南","ˌvjetˈnɑːm","vn",14.06,108.3,"Vietnam","Hanoi","河内","hæˈnɔɪ",21.03,105.85],
    ["Turkey","土耳其","ˈtɜːrki","tr",39.0,35.2,"Turkey","Ankara","安卡拉","ˈæŋkərə",39.93,32.86],
    ["Netherlands","荷兰","ˈneðərləndz","nl",52.1,5.3,"Netherlands","Amsterdam","阿姆斯特丹","ˈæmstərdæm",52.37,4.90],
    ["Switzerland","瑞士","ˈswɪtsərlənd","ch",46.8,8.2,"Switzerland","Bern","伯尔尼","bɜːrn",46.95,7.45],
    ["Sweden","瑞典","ˈswiːdən","se",60.1,18.6,"Sweden","Stockholm","斯德哥尔摩","ˈstɒkhəʊlm",59.33,18.07],
    ["Norway","挪威","ˈnɔːrweɪ","no",60.5,8.5,"Norway","Oslo","奥斯陆","ˈɒzloʊ",59.91,10.75],
    ["Greece","希腊","ɡriːs","gr",39.1,21.8,"Greece","Athens","雅典","ˈæθɪnz",37.98,23.73],
    ["Portugal","葡萄牙","ˈpɔːrtʃʊɡl","pt",39.4,-8.2,"Portugal","Lisbon","里斯本","ˈlɪzbən",38.72,-9.14],
    ["Poland","波兰","ˈpoʊlənd","pl",51.9,19.1,"Poland","Warsaw","华沙","ˈwɔːrsɔː",52.23,21.01],
    ["Ireland","爱尔兰","ˈaɪərlənd","ie",53.4,-8.2,"Ireland","Dublin","都柏林","ˈdʌblɪn",53.35,-6.26],
    ["New Zealand","新西兰","njuː ˈziːlənd","nz",-40.9,174.9,"New Zealand","Wellington","惠灵顿","ˈwelɪŋtən",-41.29,174.78],
    ["Argentina","阿根廷","ˌɑːrdʒənˈtiːnə","ar",-38.4,-63.6,"Argentina","Buenos Aires","布宜诺斯艾利斯","ˈbweɪnəs ˈaɪrɪz",-34.60,-58.38],
    ["South Africa","南非","ˈsaʊθ ˈæfrɪkə","za",-30.6,22.9,"South Africa","Pretoria","比勒陀利亚","prɪˈtɔːriə",-25.75,28.19],
    ["Saudi Arabia","沙特阿拉伯","ˈsaʊdi əˈreɪbiə","sa",23.9,45.1,"Saudi Arabia","Riyadh","利雅得","rɪˈjɑːd",24.71,46.68],
    ["Indonesia","印度尼西亚","ˌɪndəˈniːʒə","id",-0.79,113.9,"Indonesia","Jakarta","雅加达","dʒəˈkɑːrtə",-6.21,106.85],
    ["Malaysia","马来西亚","məˈleɪʒə","my",4.2,101.98,"Malaysia","Kuala Lumpur","吉隆坡","ˈkwɑːlə ˈlʊmpʊr",3.14,101.69],
    ["Philippines","菲律宾","ˈfɪlɪpiːnz","ph",12.9,121.8,"Philippines","Manila","马尼拉","məˈnɪlə",14.60,120.98],
    ["Finland","芬兰","ˈfɪnlənd","fi",61.9,25.7,"Finland","Helsinki","赫尔辛基","ˈhelsɪŋki",60.17,24.94],
    ["Denmark","丹麦","ˈdenmɑːrk","dk",56.3,9.5,"Denmark","Copenhagen","哥本哈根","ˈkoʊpənhɑːɡən",55.68,12.57],
    ["Belgium","比利时","ˈbeldʒəm","be",50.5,4.5,"Belgium","Brussels","布鲁塞尔","ˈbrʌslz",50.85,4.35],
    ["Austria","奥地利","ˈɔːstriə","at",47.5,14.6,"Austria","Vienna","维也纳","viˈenə",48.21,16.37],
    ["Czech Republic","捷克","tʃek rɪˈpʌblɪk","cz",49.8,15.5,"Czechia","Prague","布拉格","prɑːɡ",50.08,14.44],
    ["Ukraine","乌克兰","juˈkreɪn","ua",48.4,31.2,"Ukraine","Kyiv","基辅","ˈkiːjɪv",50.45,30.52],
    ["Romania","罗马尼亚","roʊˈmeɪniə","ro",45.9,24.9,"Romania","Bucharest","布加勒斯特","ˈbuːkərest",44.43,26.10],
    ["Hungary","匈牙利","ˈhʌŋɡəri","hu",47.2,19.5,"Hungary","Budapest","布达佩斯","ˈbjuːdəpest",47.50,19.04],
    ["Bulgaria","保加利亚","bʌlˈɡɛəriə","bg",42.7,25.5,"Bulgaria","Sofia","索菲亚","ˈsoʊfiə",42.70,23.32],
    ["Croatia","克罗地亚","kroʊˈeɪʃə","hr",45.1,15.2,"Croatia","Zagreb","萨格勒布","ˈzɑːɡreb",45.81,15.98],
    ["Serbia","塞尔维亚","ˈsɜːrbiə","rs",44.0,21.0,"Serbia","Belgrade","贝尔格莱德","ˈbelɡreɪd",44.79,20.45],
    ["Iceland","冰岛","ˈaɪslənd","is",64.96,-19.0,"Iceland","Reykjavík","雷克雅未克","ˌreɪkjəˈviːk",64.15,-21.94],
    ["Luxembourg","卢森堡","ˈlʌksəmbɜːrɡ","lu",49.8,6.1,"Luxembourg","Luxembourg","卢森堡","ˈlʌksəmbɜːrɡ",49.61,6.13],
    ["Chile","智利","ˈtʃɪli","cl",-35.7,-71.5,"Chile","Santiago","圣地亚哥","ˌsæntiˈɑːɡoʊ",-33.45,-70.66],
    ["Colombia","哥伦比亚","kəˈlɒmbiə","co",4.6,-74.3,"Colombia","Bogotá","波哥大","ˌboʊɡəˈtɑː",4.71,-74.07],
    ["Peru","秘鲁","pəˈruː","pe",-9.2,-75.0,"Peru","Lima","利马","ˈliːmə",-12.05,-77.04],
    ["Venezuela","委内瑞拉","ˌvenəˈzweɪlə","ve",6.4,-66.6,"Venezuela","Caracas","加拉加斯","kəˈrɑːkəs",10.48,-66.90],
    ["Ecuador","厄瓜多尔","ˈekwədɔːr","ec",-1.8,-78.2,"Ecuador","Quito","基多","ˈkiːtoʊ",-0.18,-78.47],
    ["Cuba","古巴","ˈkjuːbə","cu",21.5,-77.8,"Cuba","Havana","哈瓦那","həˈvænə",23.11,-82.37],
    ["Nigeria","尼日利亚","naɪˈdʒɪəriə","ng",9.1,8.7,"Nigeria","Abuja","阿布贾","əˈbuːdʒə",9.07,7.49],
    ["Kenya","肯尼亚","ˈkenjə","ke",-0.02,37.9,"Kenya","Nairobi","内罗毕","naɪˈroʊbi",-1.29,36.82],
    ["Morocco","摩洛哥","məˈrɒkoʊ","ma",31.8,-7.1,"Morocco","Rabat","拉巴特","rəˈbɑːt",34.02,-6.85],
    ["Tunisia","突尼斯","ˈtuːnɪʒə","tn",33.9,9.5,"Tunisia","Tunis","突尼斯","ˈtuːnɪs",36.81,10.18],
    ["Israel","以色列","ˈɪzriəl","il",31.0,35.0,"Israel","Jerusalem","耶路撒冷","dʒəˈruːsələm",31.78,35.22],
    ["United Arab Emirates","阿联酋","juˈnaɪtɪd ˈærəb ˈemɪrɪts","ae",23.4,53.8,"United Arab Emirates","Abu Dhabi","阿布扎比","ˌæbuː ˈdɑːbi",24.45,54.38],
    ["Qatar","卡塔尔","ˈkɑːtɑːr","qa",25.3,51.2,"Qatar","Doha","多哈","ˈdoʊhə",25.29,51.53],
    ["Kuwait","科威特","kəˈweɪt","kw",29.3,47.5,"Kuwait","Kuwait City","科威特城","kəˈweɪt ˈsɪti",29.38,47.99],
    ["Pakistan","巴基斯坦","ˌpɑːkɪˈstɑːn","pk",30.4,69.3,"Pakistan","Islamabad","伊斯兰堡","ɪsˈlɑːməbɑːd",33.68,73.05],
    ["Bangladesh","孟加拉国","ˌbæŋɡləˈdeʃ","bd",23.7,90.4,"Bangladesh","Dhaka","达卡","ˈdɑːkə",23.81,90.41],
    ["Sri Lanka","斯里兰卡","ˌsri ˈlæŋkə","lk",7.9,80.8,"Sri Lanka","Colombo","科伦坡","kəˈlʌmboʊ",6.93,79.85],
    ["Nepal","尼泊尔","nəˈpɔːl","np",28.4,84.1,"Nepal","Kathmandu","加德满都","ˌkɑːtmɑːnduː",27.72,85.32],
    ["Iran","伊朗","ɪˈrɑːn","ir",32.4,53.7,"Iran","Tehran","德黑兰","teˈrɑːn",35.69,51.39],
    ["Iraq","伊拉克","ɪˈrɑːk","iq",33.2,43.7,"Iraq","Baghdad","巴格达","ˈbæɡdæd",33.32,44.36],
    ["Afghanistan","阿富汗","æfˈɡænɪstɑːn","af",33.9,67.7,"Afghanistan","Kabul","喀布尔","ˈkɑːbʊl",34.53,69.17],
    ["Kazakhstan","哈萨克斯坦","ˌkæzækˈstɑːn","kz",48.0,67.0,"Kazakhstan","Astana","阿斯塔纳","əsˈtɑːnə",51.17,71.45],
    ["Mongolia","蒙古","ˈmɒŋɡoʊliə","mn",46.9,103.8,"Mongolia","Ulaanbaatar","乌兰巴托","ˌuːlɑːnˈbɑːtər",47.92,106.92],
    ["North Korea","朝鲜","nɔːrθ kəˈriə","kp",40.3,127.5,"North Korea","Pyongyang","平壤","ˌpjɒŋˈjæŋ",39.03,125.75],
    ["Myanmar","缅甸","ˈmjænmɑːr","mm",21.9,95.96,"Myanmar","Naypyidaw","内比都","ˌneɪpjɪˈdɔː",19.76,96.13],
    ["Cambodia","柬埔寨","kæmˈboʊdiə","kh",12.6,104.9,"Cambodia","Phnom Penh","金边","ˌpnɒm ˈpen",11.56,104.92],
    ["Laos","老挝","laʊs","la",19.9,102.5,"Laos","Vientiane","万象","ˌvjentɪˈɑːn",17.97,102.61],
    ["Brunei","文莱","bruːˈnaɪ","bn",4.5,114.7,"Brunei","Bandar Seri Begawan","斯里巴加湾市","ˌbɑːndər ˌseri bəˈɡɑːwən",4.94,114.95],
    ["Slovakia","斯洛伐克","sloʊˈvækiə","sk",48.7,19.7,"Slovakia","Bratislava","布拉迪斯拉发","ˌbrɑːtɪˈslɑːvə",48.15,17.12],
    ["Slovenia","斯洛文尼亚","sloʊˈviːniə","si",46.1,14.8,"Slovenia","Ljubljana","卢布尔雅那","ljuːˈbljɑːnə",46.05,14.51],
    ["Estonia","爱沙尼亚","eˈstoʊniə","ee",58.6,25.0,"Estonia","Tallinn","塔林","ˈtɑːlɪn",59.44,24.75],
    ["Latvia","拉脱维亚","ˈlɑːtviə","lv",56.9,24.6,"Latvia","Riga","里加","ˈriːɡə",56.95,24.11],
    ["Lithuania","立陶宛","ˌlɪθjuˈeɪniə","lt",55.2,23.9,"Lithuania","Vilnius","维尔纽斯","ˈvɪlniəs",54.69,25.28],
    ["Belarus","白俄罗斯","ˌbeləˈruːs","by",53.7,27.9,"Belarus","Minsk","明斯克","mɪnsk",53.90,27.57],
    ["Georgia","格鲁吉亚","ˈdʒɔːrdʒə","ge",42.3,43.6,"Georgia","Tbilisi","第比利斯","təˈbɪlɪsi",41.72,44.78],
    ["Armenia","亚美尼亚","ɑːrˈmiːniə","am",40.3,45.0,"Armenia","Yerevan","埃里温","ˌjerəˈvɑːn",40.18,44.51],
    ["Azerbaijan","阿塞拜疆","ˌæzərbaɪˈdʒɑːn","az",40.1,47.6,"Azerbaijan","Baku","巴库","bɑːˈkuː",40.41,49.87],
    ["Jordan","约旦","ˈdʒɔːrdn","jo",31.3,36.6,"Jordan","Amman","安曼","əˈmɑːn",31.95,35.93],
    ["Lebanon","黎巴嫩","ˈlebənən","lb",33.9,35.9,"Lebanon","Beirut","贝鲁特","beɪˈruːt",33.89,35.50],
    ["Syria","叙利亚","ˈsɪriə","sy",35.0,38.5,"Syria","Damascus","大马士革","dəˈmæskəs",33.51,36.29],
    ["Oman","阿曼","oʊˈmɑːn","om",21.5,56.1,"Oman","Muscat","马斯喀特","mʌsˈkɑːt",23.59,58.41],
    ["Bahrain","巴林","bɑːˈreɪn","bh",26.0,50.5,"Bahrain","Manama","麦纳麦","məˈnɑːmə",26.22,50.58],
    ["Yemen","也门","ˈjemen","ye",15.6,48.5,"Yemen","Sana'a","萨那","sɑːˈnɑː",15.37,44.19],
    ["Algeria","阿尔及利亚","ˌældʒɪˈrɪə","dz",28.0,1.7,"Algeria","Algiers","阿尔及尔","ælˈdʒɪərz",36.75,3.06],
    ["Libya","利比亚","ˈlɪbiə","ly",26.3,17.2,"Libya","Tripoli","的黎波里","ˈtrɪpəli",32.89,13.19],
    ["Ethiopia","埃塞俄比亚","ˌiːθiˈoʊpiə","et",9.1,40.5,"Ethiopia","Addis Ababa","亚的斯亚贝巴","ˌædɪs ˈæbəbə",9.03,38.74],
    ["Ghana","加纳","ˈɡɑːnə","gh",7.9,-1.0,"Ghana","Accra","阿克拉","əˈkrɑː",5.60,-0.19],
    ["Tanzania","坦桑尼亚","ˌtænzəˈniːə","tz",-6.4,34.9,"Tanzania","Dodoma","多多马","dəˈdoʊmə",-6.16,35.75],
    ["Uganda","乌干达","juˈɡændə","ug",1.4,32.3,"Uganda","Kampala","坎帕拉","kæmˈpɑːlə",0.35,32.58],
    ["Angola","安哥拉","æŋˈɡoʊlə","ao",-11.2,17.9,"Angola","Luanda","罗安达","luˈændə",-8.84,13.23],
    ["Panama","巴拿马","ˈpænəmɑː","pa",8.5,-80.8,"Panama","Panama City","巴拿马城","ˌpænəˈmɑː ˈsɪti",8.98,-79.52],
    ["Costa Rica","哥斯达黎加","ˌkoʊstə ˈriːkə","cr",9.7,-83.8,"Costa Rica","San José","圣何塞","ˌsɑːn hoʊˈzeɪ",9.93,-84.08]
  ];

  const countries = RAW.map(r => ({
    en: r[0], zh: r[1], ipa: r[2],
    geo: { iso: r[3], lat: r[4], lon: r[5], mapName: r[6] }
  }));

  const capitals = RAW.map(r => ({
    en: r[7], zh: r[8], ipa: r[9],
    geo: { iso: r[3], lat: r[10], lon: r[11], mapName: r[6] }
  }));

  /* 国旗立体球体的专属装饰配件
   * 仅五常（美/英/法/俄/中）+ 知名度较高的国家逐一配置；
   * 其余国家由 index.html 的 recommendAccessory() 做 AI 智能推荐。
   * 配饰摆放在球体中上部（眼/头顶位置）。 */
  window.GLOBE_ACCESSORIES = {
    us: { kind: 'sunglasses', color: 0x141414, emoji: '🕶️', label: '美国戴上了酷酷墨镜' },
    gb: { kind: 'crown',      color: 0xffd43b, emoji: '👑', label: '英国戴上了小皇冠' },
    fr: { kind: 'hat',        color: 0x3b5bdb, emoji: '🎩', label: '法国戴上了贝雷帽' },
    cn: { kind: 'star',       color: 0xe03131, emoji: '⭐', label: '中国头顶红五星' },
    ru: { kind: 'hat',        color: 0x6b4f2a, emoji: '🧢', label: '俄罗斯戴上了毛皮帽' },
    jp: { kind: 'headband',   color: 0xe03131, emoji: '🎌', label: '日本系上了必胜头带' },
    de: { kind: 'glasses',    color: 0x495057, emoji: '🤓', label: '德国戴上了圆框眼镜' },
    br: { kind: 'sunglasses', color: 0x212529, emoji: '🕶️', label: '巴西戴上了墨镜' },
    ca: { kind: 'hat',        color: 0xe03131, emoji: '🍁', label: '加拿大戴上了红枫帽' },
    au: { kind: 'hat',        color: 0xb08968, emoji: '🤠', label: '澳大利亚戴上了牛仔帽' },
    in: { kind: 'headband',   color: 0xf08c00, emoji: '🎌', label: '印度系上了藏红花头带' },
    it: { kind: 'glasses',    color: 0x495057, emoji: '🤓', label: '意大利戴上了圆框眼镜' },
    es: { kind: 'hat',        color: 0xe03131, emoji: '🎩', label: '西班牙戴上了小红帽' },
    kr: { kind: 'glasses',    color: 0x495057, emoji: '🤓', label: '韩国戴上了圆框眼镜' },
    mx: { kind: 'hat',        color: 0x2f9e44, emoji: '🎩', label: '墨西哥戴上了绿帽子' },
    eg: { kind: 'headband',   color: 0xf0c040, emoji: '👑', label: '埃及戴上了法老金头带' },
    za: { kind: 'sunglasses', color: 0x212529, emoji: '🕶️', label: '南非戴上了墨镜' },
    nl: { kind: 'hat',        color: 0xf76707, emoji: '🎩', label: '荷兰戴上了橙色帽' }
  };

  window.DECKS = window.DECKS || [];
  window.DECKS.push({
    id: 'world',
    name: '世界地理',
    icon: '🌍',
    tip: '看国旗、找地图位置，一边认世界一边学英文。',
    groups: [
      { id: 'country', name: '国家（100）', icon: '🌍', words: countries },
      { id: 'capital', name: '首都（100）', icon: '🏛️', words: capitals }
    ]
  });
})();
