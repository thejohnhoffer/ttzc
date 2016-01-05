/**
 * TTZC
 * The Time Zone Converter javascript code.
 **/

var LOCAL_TIME_STRING = "Local time";
var RIGHT_DEFAULT_CONTEXT = "";
var TIME_FORMAT_24H = 'HH:mm';
var TIME_FORMAT_12H = 'h:mm tt';
var nextyear = new Date( );
nextyear.setFullYear(nextyear.getFullYear( ) + 1);
var COOKIE_META = 'expires='+nextyear.toGMTString();
var COOKIE_NAME = 'prefs';
var cookie = new Cookie(COOKIE_NAME);
var convert_map = {}; // mapping of context strings ("Chicago", "GMT+3") to offset in seconds
var time_format = 't';
var LOCAL_TIME_UPDATE_TIMEOUT_ID = null;
var LOCAL_TIME_UPDATE_INTERVAL = 1000 * 60;
var local_dirty = false; // This tracks whether time1 or 2 has been changed from default 'now' value, for purposes of updating it live

var gmts, tznames, cities, warnings;
var shortTimes = {"az-cyrl-az":"H:mm"};
  //generated 2016-01-05 11:55:10.423249
  var shortTimes = {"az-cyrl-az":"H:mm","fa-ir":"hh:mm tt","es-do":"hh:mm tt","quz-bo":"hh:mm:ss tt","sk-sk":"H:mm","es-py":"hh:mm tt","th-th":"H:mm","ur-pk":"h:mm tt","gu-in":"HH:mm","sms-fi":"H:mm:ss","ns-za":"hh:mm:ss tt","es-hn":"hh:mm tt","es-ec":"H:mm","ar-ye":"hh:mm tt","bs-latn-ba":"H:mm:ss","id-id":"H:mm","es-co":"hh:mm tt","es-pa":"hh:mm tt","ar-qa":"hh:mm tt","de-li":"HH:mm","mn-mn":"H:mm","fr-mc":"HH:mm","sr-cyrl-ba":"H:mm:ss","pt-pt":"H:mm","af-za":"hh:mm tt","es-ve":"hh:mm tt","es-sv":"hh:mm tt","uz-cyrl-uz":"HH:mm","ar-ma":"H:mm","es-mx":"hh:mm tt","zh-sg":"tt h:mm","uz-latn-uz":"HH:mm","es-bo":"hh:mm tt","ms-bn":"H:mm","pl-pl":"HH:mm","en-029":"h:mm tt","fr-lu":"HH:mm","fo-fo":"HH.mm","fr-fr":"HH:mm","ar-jo":"hh:mm tt","sa-in":"HH:mm","eu-es":"HH:mm","es-pr":"hh:mm tt","en-nz":"h:mm tt","kk-kz":"H:mm","de-lu":"HH:mm","he-il":"HH:mm","tn-za":"hh:mm:ss tt","te-in":"HH:mm","es-ni":"hh:mm tt","es-uy":"hh:mm tt","bg-bg":"HH:mm","de-de":"HH:mm","sr-cyrl-cs":"H:mm","nn-no":"HH:mm","ar-bh":"hh:mm tt","se-fi":"H:mm:ss","lv-lv":"H:mm","en-ie":"HH:mm","ar-sy":"hh:mm tt","en-gb":"HH:mm","sma-se":"HH:mm:ss","ta-in":"HH:mm","se-no":"HH:mm:ss","syr-sy":"hh:mm tt","is-is":"HH:mm","kok-in":"HH:mm","sma-no":"HH:mm:ss","sw-ke":"h:mm tt","pt-br":"H:mm","ar-kw":"hh:mm tt","zh-cn":"H:mm","ar-eg":"hh:mm tt","sv-se":"HH:mm","pa-in":"tt hh:mm","en-za":"hh:mm tt","hu-hu":"H:mm","mt-mt":"HH:mm:ss","fr-ca":"HH:mm","fr-ch":"HH:mm","en-au":"h:mm tt","ar-ae":"hh:mm tt","smj-no":"HH:mm:ss","zh-mo":"H:mm","ar-lb":"hh:mm tt","ar-dz":"H:mm","cy-gb":"HH:mm:ss","smj-se":"HH:mm:ss","ca-es":"HH:mm","ky-kg":"H:mm","ka-ge":"H:mm","da-dk":"HH:mm","gl-es":"H:mm","se-se":"HH:mm:ss","kn-in":"HH:mm","ro-ro":"HH:mm","et-ee":"H:mm","en-us":"h:mm tt","sv-fi":"HH:mm","nl-nl":"H:mm","en-ph":"h:mm tt","vi-vn":"h:mm tt","en-jm":"hh:mm tt","ar-tn":"H:mm","ar-om":"hh:mm tt","de-at":"HH:mm","tt-ru":"H:mm","ar-sa":"hh:mm tt","lt-lt":"HH:mm","es-gt":"hh:mm tt","nl-be":"H:mm","es-cr":"hh:mm tt","zu-za":"hh:mm:ss tt","be-by":"H:mm","sl-si":"H:mm","xh-za":"hh:mm:ss tt","nb-no":"HH:mm","ja-jp":"H:mm","sr-latn-ba":"H:mm:ss","sr-latn-cs":"H:mm","fr-be":"H:mm","sq-al":"h:mm.tt","en-zw":"h:mm tt","en-tt":"hh:mm tt","en-bz":"hh:mm tt","es-es":"H:mm","es-pe":"hh:mm tt","hy-am":"H:mm","de-ch":"HH:mm","ar-ly":"hh:mm tt","fi-fi":"H:mm","uk-ua":"H:mm","ms-my":"H:mm","mi-nz":"h:mm:ss tt","cs-cz":"H:mm","es-cl":"H:mm","dv-mv":"HH:mm","it-it":"H.mm","ru-ru":"H:mm","en-ca":"h:mm tt","el-gr":"h:mm tt","es-ar":"hh:mm tt","quz-pe":"hh:mm:ss tt","zh-tw":"tt hh:mm","hr-hr":"H:mm","quz-ec":"H:mm:ss","it-ch":"HH:mm","hr-ba":"H:mm:ss","ar-iq":"hh:mm tt","smn-fi":"H:mm:ss","zh-hk":"H:mm","hi-in":"HH:mm","az-latn-az":"H:mm","tr-tr":"HH:mm","mk-mk":"HH:mm","ko-kr":"tt h:mm","mr-in":"HH:mm"};
  var gmts = {"GMT":0,"UTC":0,"GMT-14":-50400,"UTC-14":-50400,"GMT-13":-46800,"UTC-13":-46800,"GMT-12":-43200,"UTC-12":-43200,"GMT-11":-39600,"UTC-11":-39600,"GMT-10":-36000,"UTC-10":-36000,"GMT-9":-32400,"UTC-9":-32400,"GMT-8":-28800,"UTC-8":-28800,"GMT-7":-25200,"UTC-7":-25200,"GMT-6":-21600,"UTC-6":-21600,"GMT-5":-18000,"UTC-5":-18000,"GMT-4":-14400,"UTC-4":-14400,"GMT-3":-10800,"UTC-3":-10800,"GMT-2":-7200,"UTC-2":-7200,"GMT-1":-3600,"UTC-1":-3600,"GMT+0":0,"UTC+0":0,"GMT+1":3600,"UTC+1":3600,"GMT+2":7200,"UTC+2":7200,"GMT+3":10800,"UTC+3":10800,"GMT+4":14400,"UTC+4":14400,"GMT+5":18000,"UTC+5":18000,"GMT+6":21600,"UTC+6":21600,"GMT+7":25200,"UTC+7":25200,"GMT+8":28800,"UTC+8":28800,"GMT+9":32400,"UTC+9":32400,"GMT+10":36000,"UTC+10":36000,"GMT+11":39600,"UTC+11":39600,"GMT+12":43200,"UTC+12":43200,"GMT+13":46800,"UTC+13":46800,"GMT+14":50400,"UTC+14":50400};
  var tznames = {"CEDT (Central European Daylight Time)":7200,"Central European Daylight Time (CEDT)":7200,"CEST (Central European Summer Time)":7200,"Central European Summer Time (CEST)":7200,"EDT (Eastern Daylight Time)":-14400,"Eastern Daylight Time (EDT)":-14400,"EST (Eastern Standard Time)":-18000,"Eastern Standard Time (EST)":-18000,"PDT (Pacific Daylight Time)":-25200,"Pacific Daylight Time (PDT)":-25200,"PST (Pacific Standard Time)":-28800,"Pacific Standard Time (PST)":-28800,"MDT (Mountain Daylight Time)":-21600,"Mountain Daylight Time (MDT)":-21600,"MST (Mountain Standard Time)":-25200,"Mountain Standard Time (MST)":-25200,"CDT (Central Daylight Time)":-18000,"Central Daylight Time (CDT)":-18000,"CST (Central Standard Time)":-21600,"Central Standard Time (CST)":-21600,"NZST (New Zealand Standard Time)":43200,"New Zealand Standard Time (NZST)":43200,"NZDT (New Zealand Daylight Time)":46800,"New Zealand Daylight Time (NZDT)":46800,"A (Alpha Time Zone)":3600,"Alpha Time Zone (A)":3600,"ACDT (Australian Central Daylight Time)":37800,"Australian Central Daylight Time (ACDT)":37800,"ACST (Australian Central Standard Time)":34200,"Australian Central Standard Time (ACST)":34200,"ADT (Atlantic Daylight Time)":-10800,"Atlantic Daylight Time (ADT)":-10800,"AEDT (Australian Eastern Daylight Time)":39600,"Australian Eastern Daylight Time (AEDT)":39600,"AEST (Australian Eastern Standard Time)":36000,"Australian Eastern Standard Time (AEST)":36000,"AKDT (Alaska Daylight Time)":-28800,"Alaska Daylight Time (AKDT)":-28800,"AKST (Alaska Standard Time)":-32400,"Alaska Standard Time (AKST)":-32400,"AST (Atlantic Standard Time)":-14400,"Atlantic Standard Time (AST)":-14400,"AWDT (Australian Western Daylight Time)":32400,"Australian Western Daylight Time (AWDT)":32400,"AWST (Australian Western Standard Time)":28800,"Australian Western Standard Time (AWST)":28800,"B (Bravo Time Zone)":7200,"Bravo Time Zone (B)":7200,"BST (British Summer Time)":3600,"British Summer Time (BST)":3600,"C (Charlie Time Zone)":10800,"Charlie Time Zone (C)":10800,"CET (Central European Time)":3600,"Central European Time (CET)":3600,"CXT (Christmas Island Time)":25200,"Christmas Island Time (CXT)":25200,"D (Delta Time Zone)":14400,"Delta Time Zone (D)":14400,"E (Echo Time Zone)":18000,"Echo Time Zone (E)":18000,"EEDT (Eastern European Daylight Time)":10800,"Eastern European Daylight Time (EEDT)":10800,"EEST (Eastern European Summer Time)":10800,"Eastern European Summer Time (EEST)":10800,"EET (Eastern European Time)":7200,"Eastern European Time (EET)":7200,"F (Foxtrot Time Zone)":21600,"Foxtrot Time Zone (F)":21600,"G (Golf Time Zone)":25200,"Golf Time Zone (G)":25200,"GMT (Greenwich Mean Time)":0,"Greenwich Mean Time (GMT)":0,"H (Hotel Time Zone)":28800,"Hotel Time Zone (H)":28800,"HADT (Hawaii-Aleutian Daylight Time)":-32400,"Hawaii-Aleutian Daylight Time (HADT)":-32400,"HAST (Hawaii-Aleutian Standard Time)":-36000,"Hawaii-Aleutian Standard Time (HAST)":-36000,"HST (Hawaii Standard Time)":-36000,"Hawaii Standard Time (HST)":-36000,"IST (Irish Summer Time)":3600,"Irish Summer Time (IST)":3600,"K (Kilo Time Zone)":36000,"Kilo Time Zone (K)":36000,"L (Lima Time Zone)":39600,"Lima Time Zone (L)":39600,"M (Mike Time Zone)":43200,"Mike Time Zone (M)":43200,"MESZ (Mitteleuropäische Sommerzeit)":7200,"Mitteleuropäische Sommerzeit (MESZ)":7200,"MEZ (Mitteleuropäische Zeit)":3600,"Mitteleuropäische Zeit (MEZ)":3600,"MSD (Moscow Daylight Time)":14400,"Moscow Daylight Time (MSD)":14400,"MSK (Moscow Standard Time)":10800,"Moscow Standard Time (MSK)":10800,"N (November Time Zone)":-3600,"November Time Zone (N)":-3600,"NDT (Newfoundland Daylight Time)":-9000,"Newfoundland Daylight Time (NDT)":-9000,"NFT (Norfolk (Island) Time)":41400,"Norfolk (Island) Time (NFT)":41400,"NST (Newfoundland Standard Time)":-12600,"Newfoundland Standard Time (NST)":-12600,"O (Oscar Time Zone)":-7200,"Oscar Time Zone (O)":-7200,"P (Papa Time Zone)":-10800,"Papa Time Zone (P)":-10800,"Q (Quebec Time Zone)":-14400,"Quebec Time Zone (Q)":-14400,"R (Romeo Time Zone)":-18000,"Romeo Time Zone (R)":-18000,"S (Sierra Time Zone)":-21600,"Sierra Time Zone (S)":-21600,"T (Tango Time Zone)":-25200,"Tango Time Zone (T)":-25200,"U (Uniform Time Zone)":-28800,"Uniform Time Zone (U)":-28800,"UTC (Coordinated Universal Time)":0,"Coordinated Universal Time (UTC)":0,"UTC":0,"V (Victor Time Zone)":-32400,"Victor Time Zone (V)":-32400,"W (Whiskey Time Zone)":-36000,"Whiskey Time Zone (W)":-36000,"WDT (Western Daylight Time)":32400,"Western Daylight Time (WDT)":32400,"WEDT (Western European Daylight Time)":3600,"Western European Daylight Time (WEDT)":3600,"WEST (Western European Summer Time)":3600,"Western European Summer Time (WEST)":3600,"WET (Western European Time)":0,"Western European Time (WET)":0,"WST (Western Standard Time)":28800,"Western Standard Time (WST)":28800,"X (X-ray Time Zone)":-39600,"X-ray Time Zone (X)":-39600,"Y (Yankee Time Zone)":-43200,"Yankee Time Zone (Y)":-43200,"Z (Zulu Time Zone)":0,"Zulu Time Zone (Z)":0};
  var cities = {"Aba":3600,"Abadan":12600,"Abeokuta":3600,"Abidjan":0,"Abobo":0,"Abomey-Calavi":3600,"Abu Dhabi":14400,"Abu Ghurayb":10800,"Abuja":3600,"Acapulco de Juarez":-21600,"Accra":0,"Ad Dammam":10800,"Adamstown":-28800,"Adana":7200,"Addis Ababa":10800,"Adelaide":37800,"Afghanistan":16200,"Agadir":0,"Agra":19800,"Aguascalientes":-21600,"Ahmadabad":19800,"Ahvaz":12600,"Ajmer":19800,"Akola":19800,"Akure":3600,"Al Basrah":10800,"Al Basrah al Qadimah":10800,"Al Hudaydah":10800,"Al Jizah":7200,"Al Mahallah al Kubra":7200,"Al Mansurah":7200,"Al Mawsil al Jadidah":10800,"Al Ubayyid":10800,"Al `Ayn":14400,"Alabama":-21600,"Aland Islands":7200,"Alaska":-32400,"Albania":3600,"Albuquerque":-25200,"Aleppo":7200,"Alexandria":7200,"Algeria":3600,"Algiers":3600,"Aligarh":19800,"Allahabad":19800,"Almaty":21600,"Alofi":-39600,"Amagasaki":32400,"American Samoa":-39600,"Amman":7200,"Amravati":19800,"Amritsar":19800,"Amsterdam":3600,"An Najaf":10800,"An Nasiriyah":10800,"Ananindeua":-10800,"Anchorage":-32400,"Andorra":3600,"Andorra la Vella":3600,"Angola":3600,"Anguilla":-14400,"Ankara":7200,"Ansan":32400,"Anshan":28800,"Antalya":7200,"Antananarivo":10800,"Antarctica":46800,"Antigua and Barbuda":-14400,"Antipolo":28800,"Antwerp":3600,"Aomen":28800,"Apia":50400,"Aracaju":-10800,"Arak":12600,"Arbil":10800,"Ardabil":12600,"Arequipa":-18000,"Argentina":-10800,"Arizona":-25200,"Arkansas":-21600,"Armenia":14400,"Aruba":-14400,"As Sulaymaniyah":10800,"Asansol":19800,"Ashgabat":18000,"Asmara":10800,"Astana":21600,"Astrakhan'":10800,"Asuncion":-10800,"Asyut":7200,"At Ta'if":10800,"Athens":7200,"Atlanta":-18000,"Auckland":46800,"Aurangabad":19800,"Austin":-21600,"Austria":3600,"Avarua":-36000,"Az Zarqa'":7200,"Azadshahr":12600,"Azerbaijan":14400,"Baghdad":10800,"Bahamas":-18000,"Bahawalpur":18000,"Bahrain":10800,"Bairiki":43200,"Baku":14400,"Balikpapan":28800,"Baltimore":-18000,"Bamako":0,"Bamenda":3600,"Bandar Seri Begawan":28800,"Bandung":25200,"Banghazi":7200,"Bangkok":25200,"Bangladesh":21600,"Bangui":3600,"Banjarmasin":28800,"Banjul":0,"Baoding":28800,"Baotou":28800,"Barbados":-14400,"Barcelona":3600,"Bareilly":19800,"Barnaul":21600,"Barquisimeto":-16200,"Barranquilla":-18000,"Basse-Terre":-14400,"Basseterre":-14400,"Beijing":28800,"Beira":7200,"Beirut":7200,"Bekasi":25200,"Belarus":10800,"Belem":-10800,"Belford Roxo":-7200,"Belgaum":19800,"Belgium":3600,"Belgrade":3600,"Belize":-21600,"Bello":-18000,"Belmopan":-21600,"Belo Horizonte":-7200,"Benares":19800,"Bengaluru":19800,"Bengbu":28800,"Benin":3600,"Benin-City":3600,"Benoni":7200,"Benxi":28800,"Berlin":3600,"Bermuda":-14400,"Bern":3600,"Betim":-7200,"Bhatpara":19800,"Bhavnagar":19800,"Bhilai":19800,"Bhiwandi":19800,"Bhopal":19800,"Bhubaneshwar":19800,"Bhutan":21600,"Bien Hoa":25200,"Bikaner":19800,"Billings":-25200,"Bishkek":21600,"Bissau":0,"Blantyre":7200,"Bloemfontein":7200,"Bochum":3600,"Bochum-Hordel":3600,"Bogor":25200,"Bogota":-18000,"Boise":-25200,"Bokaro":19800,"Boksburg":7200,"Bolivia":-14400,"Bologna":3600,"Bosnia and Herzegovina":3600,"Boston":-18000,"Botswana":7200,"Bouake":0,"Boumerdas":3600,"Bouvet Island":3600,"Brasilia":-7200,"Bratislava":3600,"Brazil - Sao Paulo":-7200,"Brazzaville":3600,"Bremen":3600,"Bridgeport":-18000,"Bridgetown":-14400,"Brisbane":36000,"Bristol":0,"British Indian Ocean Territory":21600,"British Virgin Islands":-14400,"Brooklyn":-18000,"Brunei":28800,"Brussels":3600,"Bryansk":10800,"Bucaramanga":-18000,"Bucuresti":7200,"Budapest":3600,"Buenos Aires":-10800,"Bujumbura":7200,"Bulawayo":7200,"Bulgaria":7200,"Bur Sa`id":7200,"Buraydah":10800,"Burkina Faso":0,"Burlington":-18000,"Bursa":7200,"Burundi":7200,"CT (Central Time)":-21600,"Cagayan de Oro":28800,"Cairo":7200,"Calabar":3600,"Calcutta":19800,"Calgary":-25200,"Cali":-18000,"Calicut":19800,"California":-28800,"Callao":-18000,"Camayenne":0,"Cambodia":25200,"Cameroon":3600,"Campinas":-7200,"Campo Grande":-10800,"Campos":-7200,"Canada - Calgary":-25200,"Canada - Edmonton":-25200,"Canada - Halifax":-14400,"Canada - Montreal":-18000,"Canada - Quebec":-18000,"Canada - Toronto":-18000,"Canada - Vancouver":-28800,"Canada - Winnipeg":-21600,"Canberra":39600,"Cancun":-18000,"Cangzhou":28800,"Cankaya":7200,"Cape Town":7200,"Cape Verde":-3600,"Caracas":-16200,"Carrefour":-18000,"Cartagena":-18000,"Casablanca":0,"Castries":-14400,"Caxias do Sul":-7200,"Cayenne":-10800,"Cayman Islands":-18000,"Cebu City":28800,"Central African Republic":3600,"Central Time (CT)":-21600,"Ch'angwon":32400,"Ch'ongju":32400,"Chad":3600,"Chandigarh":19800,"Changchun":28800,"Changde":28800,"Changsha":28800,"Changzhi":28800,"Changzhou":28800,"Chaoyang":28800,"Chaozhou":28800,"Charleston":-18000,"Charlotte":-18000,"Cheboksary":10800,"Cheju":32400,"Chelyabinsk":18000,"Chengde":28800,"Chengdu":28800,"Chennai":19800,"Cheyenne":-25200,"Chi-lung":28800,"Chiba":32400,"Chicago":-21600,"Chiclayo":-18000,"Chihuahua":-25200,"Chile":-10800,"China":28800,"Chisinau":7200,"Chittagong":21600,"Chongqing":28800,"Chonju":32400,"Christchurch":46800,"Christmas Island":25200,"Cimahi":25200,"Ciudad Guayana":-16200,"Ciudad Juarez":-25200,"Ciudad Lopez Mateos":-21600,"Ciudad Nezahualcoyotl":-21600,"Cleveland":-18000,"Cochabamba":-14400,"Cochin":19800,"Cocos Islands":23400,"Coimbatore":19800,"Colombia":-18000,"Colombo":19800,"Colorado":-25200,"Columbia":-18000,"Columbus":-18000,"Comilla":21600,"Comoros":10800,"Conakry":0,"Congo - Kinshasa":3600,"Congo - Lubumbashi":7200,"Connecticut":-18000,"Constantine":3600,"Contagem":-7200,"Cook Islands":-36000,"Copenhagen":3600,"Cordoba":-10800,"Costa Rica":-21600,"Cotonou":3600,"Croatia":3600,"Cuautitlan Izcalli":-21600,"Cuba":-18000,"Cucuta":-18000,"Cuiaba":-10800,"Culiacan":-25200,"Curitiba":-7200,"Cuttack":19800,"Cyprus":7200,"Czech Republic":3600,"Da Nang":25200,"Dakar":0,"Dalian":28800,"Dallas":-21600,"Damascus":7200,"Dandong":28800,"Dar es Salaam":10800,"Dasmarinas":28800,"Datong":28800,"Davao":28800,"Dayan":28800,"Dehra Dun":19800,"Delaware":-18000,"Delhi":19800,"Delmas 73":-18000,"Democratic Republic of the Congo":7200,"Den Haag":3600,"Denmark":3600,"Denpasar":28800,"Denver":-25200,"Depok":25200,"Des Moines":-21600,"Detroit":-18000,"Dezhou":28800,"Dhaka":21600,"Diadema":-7200,"Diego Garcia":21600,"Dili":32400,"Diyarbakir":7200,"Djibouti":10800,"Dnipropetrovsk":7200,"Dodoma":10800,"Doha":10800,"Dominica":-14400,"Dominican Republic":-14400,"Donets'k":7200,"Dongguan":28800,"Dortmund":3600,"Douala":3600,"Douglas":0,"Dresden":3600,"Dubai":14400,"Dublin":0,"Duisburg":3600,"Duque de Caxias":-7200,"Durango":-21600,"Durban":7200,"Durgapur":19800,"Dushanbe":18000,"Dusseldorf":3600,"ET (Eastern Time)":-18000,"East Timor":32400,"Eastern Time (ET)":-18000,"Ecatepec":-21600,"Ecuador":-18000,"Edinburgh":0,"Edmonton":-25200,"Egypt":7200,"El Paso":-25200,"El Salvador":-21600,"England":0,"Enugu":3600,"Equatorial Guinea":3600,"Eritrea":10800,"Erzurum":7200,"Esfahan":12600,"Eskisehir":7200,"Essen":3600,"Estonia":7200,"Ethiopia":10800,"Faisalabad":18000,"Falkland Islands":-10800,"Fargo":-21600,"Faridabad":19800,"Faroe Islands":0,"Feira de Santana":-10800,"Fes":0,"Fiji":46800,"Finland":7200,"Florence":3600,"Florianopolis":-7200,"Florida - Miami":-18000,"Florida - Pensacola":-21600,"Flying Fish Cove":25200,"Fort Worth":-21600,"Fort-de-France":-14400,"Fortaleza":-10800,"Foshan":28800,"France":3600,"Frankfurt am Main":3600,"Freetown":0,"French Guiana":-10800,"French Polynesia":-34200,"French Southern Territories":18000,"Fresno":-28800,"Fujisawa":32400,"Fukuoka":32400,"Fukuyama":32400,"Funabashi":32400,"Funafuti":43200,"Fushun":28800,"Fuxin":28800,"Fuzhou":28800,"Gabon":3600,"Gaborone":7200,"Gambia":0,"Garoua":3600,"Gaya":19800,"Gaza":7200,"Gaziantep":7200,"Gdansk":3600,"Genova":3600,"George Town":-18000,"Georgetown":-14400,"Georgia (Country)":14400,"Georgia - United States":-18000,"Germany":3600,"Ghana":0,"Ghaziabad":19800,"Gibraltar":3600,"Gifu":32400,"Glasgow":0,"Goeteborg":3600,"Goiania":-7200,"Gold Coast":36000,"Grand Dakar":0,"Grand Turk":-14400,"Great Britain":0,"Greece":7200,"Greenland - Nuuk":-10800,"Grenada":-14400,"Grytviken":-7200,"Guadalajara":-21600,"Guadalupe":-21600,"Guadeloupe":-14400,"Guam":36000,"Guangzhou":28800,"Guarulhos":-7200,"Guatemala":-21600,"Guatemala City":-21600,"Guayaquil":-18000,"Guernsey":0,"Guilin":28800,"Guinea":0,"Guinea-Bissau":0,"Guiyang":28800,"Gujranwala":18000,"Gulbarga":19800,"Guli":28800,"Guntur":19800,"Gustavia":-14400,"Guwahati":19800,"Guyana":-14400,"Gwalior":19800,"Ha Noi":25200,"Hachioji":32400,"Hagatna":36000,"Haikou":28800,"Haiphong":25200,"Haiti":-18000,"Hamadan":12600,"Hamah":7200,"Hamamatsu":32400,"Hamburg":3600,"Hamhung":30600,"Hamilton":-18000,"Handan":28800,"Hangzhou":28800,"Hannover":3600,"Haora":19800,"Harare":7200,"Harbin":28800,"Hargeysa":10800,"Havana":-18000,"Hawaii":-36000,"Heard Island and McDonald Islands":28800,"Hefei":28800,"Hegang":28800,"Helsinki":7200,"Hengshui":28800,"Hengyang":28800,"Hermosillo":-25200,"Himeji":32400,"Hims":7200,"Hirakata":32400,"Hiroshima":32400,"Hohhot":28800,"Homyel'":10800,"Honduras":-21600,"Hong Kong":28800,"Honiara":39600,"Honolulu":-36000,"Houston":-21600,"Hsin-chu-shih":28800,"Huaibei":28800,"Huainan":28800,"Huaiyin":28800,"Huancayo":-18000,"Huangshi":28800,"Hubli":19800,"Hungary":3600,"Ibadan":3600,"Ibague":-18000,"Iceland":0,"Ichikawa":32400,"Idaho - Boise":-25200,"Illinois":-21600,"Iloilo":28800,"Ilorin":3600,"Inch'on":32400,"India":19800,"Indiana - Indianapolis":-18000,"Indianapolis":-18000,"Indonesia":28800,"Indore":19800,"Iowa":-21600,"Ipoh":28800,"Iquitos":-18000,"Iran":12600,"Iraq":10800,"Ireland":0,"Irkutsk":28800,"Islamabad":18000,"Isle of Man":0,"Israel":7200,"Istanbul":7200,"Italy":3600,"Ivanovo":10800,"Ivory Coast":0,"Izhevsk":14400,"Izmir":7200,"Jabalpur":19800,"Jaboatao":-10800,"Jaboatao dos Guararapes":-10800,"Jackson":-21600,"Jacksonville":-18000,"Jaipur":19800,"Jakarta":25200,"Jalandhar":19800,"Jalapa Enriquez":-21600,"Jalgaon":19800,"Jamaica":-18000,"Jambi":25200,"Jamestown":0,"Jammu":19800,"Jamnagar":19800,"Jamshedpur":19800,"Japan":32400,"Jersey":0,"Jerusalem":7200,"Jhansi":19800,"Jiamusi":28800,"Jiangmen":28800,"Jiaojiang":28800,"Jiaozuo":28800,"Jiaxing":28800,"Jiddah":10800,"Jieyang":28800,"Jilin":28800,"Jinan":28800,"Jining":28800,"Jinzhou":28800,"Jixi":28800,"Joao Pessoa":-10800,"Jodhpur":19800,"Johannesburg":7200,"Johor Bahru":28800,"Joinville":-7200,"Jordan":7200,"Jos":3600,"Juan Dolio":-14400,"Juiz de Fora":-7200,"Kabul":16200,"Kaduna":3600,"Kagoshima":32400,"Kahramanmaras":7200,"Kahriz":12600,"Kaifeng":28800,"Kaliningrad":7200,"Kalyan":19800,"Kampala":10800,"Kampung Baru Subang":28800,"Kananga":7200,"Kanazawa":32400,"Kandahar":16200,"Kano":3600,"Kanpur":19800,"Kansas - Wichita":-21600,"Kansas City":-21600,"Kao-hsiung":28800,"Karachi":18000,"Karagandy":18000,"Karaj":12600,"Karbala'":10800,"Kassala":10800,"Kathmandu":20700,"Katsina":3600,"Kaunas":7200,"Kawaguchi":32400,"Kawasaki":32400,"Kayseri":7200,"Kazakhstan - Almaty":21600,"Kazan'":10800,"Kemerovo":25200,"Kentucky - Lexington":-18000,"Kentucky - Lexington-Fayette":-18000,"Kentucky - Louisville":-18000,"Kentucky - Owensboro":-21600,"Kenya":10800,"Kerman":12600,"Kermanshah":12600,"Khabarovsk":36000,"Khabarovsk Vtoroy":36000,"Khamis Mushayt":10800,"Kharkiv":7200,"Khartoum":10800,"Khmel'nyts'kyy":7200,"Khulna":21600,"Kiev":7200,"Kigali":7200,"Kingston":-18000,"Kingstown":-14400,"Kinshasa":3600,"Kirkuk":10800,"Kirov":10800,"Kisangani":7200,"Kitakyushu":32400,"Kitchener":-18000,"Kitwe":7200,"Klang":28800,"Knoxville":-18000,"Kobe":32400,"Koeln":3600,"Kolhapur":19800,"Kolwezi":7200,"Konya":7200,"Korba":19800,"Koror":32400,"Kota":19800,"Kota Kinabalu":28800,"Kotli":18000,"Kousseri":3600,"Kowloon":28800,"Krakow":3600,"Krasnodar":10800,"Krasnoyarsk":25200,"Krugersdorp":7200,"Kryvyy Rih":7200,"Kuala Lumpur":28800,"Kuching":28800,"Kumamoto":32400,"Kumasi":0,"Kunming":28800,"Kurashiki":32400,"Kursk":10800,"Kuwait":10800,"Kwangju":32400,"Kyoto":32400,"Kyrgyzstan":21600,"L'viv":7200,"La Paz":-14400,"La Plata":-10800,"Lagos":3600,"Lahore":18000,"Langfang":28800,"Lanzhou":28800,"Laos":25200,"Las Palmas de Gran Canaria":0,"Las Pavas":-18000,"Las Vegas":-28800,"Latvia":7200,"Lebanon":7200,"Leeds":0,"Leipzig":3600,"Leon":-21600,"Lesotho":7200,"Lexington":-18000,"Lexington-Fayette":-18000,"Liaoyang":28800,"Liaoyuan":28800,"Liberia":0,"Libreville":3600,"Libya":7200,"Liechtenstein":3600,"Likasi":7200,"Lilongwe":7200,"Lima":-18000,"Lincoln":-21600,"Lipetsk":10800,"Lisbon":0,"Lithuania":7200,"Little Rock":-21600,"Liuyang":28800,"Liverpool":0,"Ljubljana":3600,"Lobamba":7200,"Lodz":3600,"Lome":0,"London":0,"Londrina":-7200,"Long Beach":-28800,"Longyearbyen":3600,"Los Angeles":-28800,"Louisiana":-21600,"Louisville":-18000,"Luancheng":28800,"Luanda":3600,"Lubumbashi":7200,"Lucknow":19800,"Ludhiana":19800,"Luhans'k":7200,"Luohe":28800,"Luoyang":28800,"Luqiaozhen":28800,"Lusaka":7200,"Luxembourg":3600,"Luxor":7200,"Lyon":3600,"MT (Mountain Time)":-25200,"Macao":28800,"Macedonia":3600,"Maceio":-10800,"Machida":32400,"Madagascar":10800,"Madrid":3600,"Madurai":19800,"Magnitogorsk":18000,"Maiduguri":3600,"Maine":-18000,"Majuro":43200,"Makassar":28800,"Makhachkala":10800,"Makiyivka":7200,"Malabo":3600,"Malaga":3600,"Malang":25200,"Malatya":7200,"Malawi":7200,"Malaysia":28800,"Maldives":18000,"Male":18000,"Malegaon":19800,"Mali":0,"Malta":3600,"Mamoudzou":10800,"Mamuju":28800,"Manado":28800,"Managua":-21600,"Manama":10800,"Manaus":-14400,"Mandalay":23400,"Mangalore":19800,"Manila":28800,"Mansilingan":28800,"Maputo":7200,"Mar del Plata":-10800,"Maracaibo":-16200,"Mariupol'":7200,"Marrakech":0,"Marseille":3600,"Marshall Islands":43200,"Martinique":-14400,"Maryland":-18000,"Maseru":7200,"Mashhad":12600,"Masina":3600,"Massachusetts":-18000,"Matamoros":-21600,"Matola":7200,"Matsudo":32400,"Maturin":-16200,"Maua":-7200,"Mauritania":0,"Mauritius":14400,"Mawlamyine":23400,"Mayotte":10800,"Mbabane":7200,"Mbuji-Mayi":7200,"Mecca":10800,"Medan":25200,"Medellin":-18000,"Medina":10800,"Meerut":19800,"Meknes":0,"Melbourne":39600,"Melekeok":32400,"Memphis":-21600,"Mendoza":-10800,"Mercin":7200,"Merida":-21600,"Mesa":-25200,"Mexicali":-28800,"Mexico - Mexico City":-21600,"Mexico City":-21600,"Miami":-18000,"Michigan":-18000,"Milano":3600,"Milwaukee":-21600,"Minneapolis":-21600,"Minnesota":-21600,"Minsk":10800,"Misratah":7200,"Mississippi":-21600,"Missouri":-21600,"Mixco":-21600,"Mogadishu":10800,"Moldova":7200,"Mombasa":10800,"Monaco":3600,"Mongolia":28800,"Monrovia":0,"Montana":-25200,"Montenegro":3600,"Monterrey":-21600,"Montevideo":-10800,"Montreal":-18000,"Montserrat":-14400,"Moradabad":19800,"Morelia":-21600,"Morocco":0,"Moroni":10800,"Moscow":10800,"Mosul":10800,"Mountain Time (MT)":-25200,"Mozambique":7200,"Muang Phonsavan":25200,"Mudanjiang":28800,"Muenchen":3600,"Multan":18000,"Mumbai":19800,"Munich":3600,"Murcia":3600,"Muscat":14400,"Mwanza":10800,"Myanmar":23400,"Mykolayiv":7200,"Mysore":19800,"N'Djamena":3600,"Naberezhnyye Chelny":10800,"Nagasaki":32400,"Nagoya":32400,"Nagpur":19800,"Nairobi":10800,"Namangan":18000,"Namibia":7200,"Namp'o":30600,"Nampula":7200,"Nanchang":28800,"Nanchong":28800,"Nangi":19800,"Nanjing":28800,"Nanning":28800,"Nantong":28800,"Napoli":3600,"Nashville":-21600,"Nasik":19800,"Nassau":-18000,"Natal":-10800,"Naucalpan de Juarez":-21600,"Nauru":43200,"Nay Pyi Taw":23400,"Ndola":7200,"Nebraska - Lincoln":-21600,"Nebraska - Omaha":-21600,"Neijiang":28800,"Nellore":19800,"Nepal":20700,"Nerima":32400,"Netherlands":3600,"Netherlands Antilles":-14400,"Nevada":-28800,"New Caledonia":39600,"New Delhi":19800,"New Hampshire":-18000,"New Jersey":-18000,"New Kingston":-18000,"New Mexico":-25200,"New Orleans":-21600,"New South Memphis":-21600,"New York":-18000,"New Zealand":46800,"Newark":-18000,"Niamey":3600,"Nicaragua":-21600,"Nicosia":7200,"Niger":3600,"Nigeria":3600,"Niigata":32400,"Ningbo":28800,"Nishinomiya":32400,"Niteroi":-7200,"Niue":-39600,"Nizhniy Novgorod":10800,"Nizhniy Tagil":18000,"Norfolk Island":41400,"North Carolina":-18000,"North Dakota - Fargo":-21600,"North Korea":30600,"North York":-18000,"Northern Mariana Islands":36000,"Norway":3600,"Nouakchott":0,"Noumea":39600,"Nova Iguacu":-7200,"Novokuznetsk":25200,"Novosibirsk":21600,"Nuernberg":3600,"Nuku`alofa":46800,"Nuuk":-10800,"Oakland":-28800,"Odesa":10800,"Ohio":-18000,"Oita":32400,"Okayama":32400,"Okene":3600,"Oklahoma":-21600,"Oklahoma City":-21600,"Omaha":-21600,"Oman":14400,"Omdurman":10800,"Omsk":21600,"Onitsha":3600,"Oran":3600,"Oranjestad":-14400,"Oregon - Portland":-28800,"Orenburg":18000,"Orumiyeh":12600,"Osaka":32400,"Osasco":-7200,"Oslo":3600,"Ottawa":-18000,"Ouagadougou":0,"Oujda":0,"Owensboro":-21600,"Oyo":3600,"PT (Pacific Time)":-28800,"Pacific Time (PT)":-28800,"Padang":25200,"Pago Pago":-39600,"Pakistan":18000,"Palau":32400,"Palembang":25200,"Palermo":3600,"Palestinian Territory":7200,"Palikir":39600,"Palma":3600,"Panama":-18000,"Panihati":19800,"Panshan":28800,"Panzhihua":28800,"Papeete":-36000,"Papua New Guinea":36000,"Paraguay":-10800,"Paramaribo":-10800,"Paris":3600,"Pasto":-18000,"Patna":19800,"Pennsylvania":-18000,"Pensacola":-21600,"Penza":10800,"Pereira":-18000,"Perm'":18000,"Perth":28800,"Peru":-18000,"Peshawar":18000,"Petaling Jaya":28800,"Philadelphia":-18000,"Philippines":28800,"Phnom Penh":25200,"Phoenix":-25200,"Pietermaritzburg":7200,"Pikine":0,"Pimpri":19800,"Pingdingshan":28800,"Pingxiang":28800,"Pitcairn":-28800,"Plymouth":-14400,"Podgorica":3600,"Pointe-Noire":3600,"Poland":3600,"Ponce":-14400,"Pontianak":25200,"Port Elizabeth":7200,"Port Harcourt":3600,"Port Louis":14400,"Port Moresby":36000,"Port Sudan":10800,"Port-Vila":39600,"Port-au-Prince":-18000,"Port-of-Spain":-14400,"Porto Alegre":-7200,"Porto-Novo":3600,"Portugal":0,"Poznan":3600,"Praha":3600,"Praia":-3600,"Pretoria":7200,"Pristina":3600,"Providence":-18000,"Puch'on":32400,"Puebla de Zaragoza":-21600,"Puerto Rico":-14400,"Pune":19800,"Pusan":32400,"Putian":28800,"Pyongyang":30600,"Qaraghandy":21600,"Qatar":10800,"Qingdao":28800,"Qinhuangdao":28800,"Qiqihar":28800,"Qom":12600,"Quebec":-18000,"Queretaro":-21600,"Quetta":18000,"Quilmes":-10800,"Quilon":19800,"Quito":-18000,"Ra's Bayrut":7200,"Rabat":0,"Raipur":19800,"Rajkot":19800,"Rajshahi":21600,"Ranchi":19800,"Rangoon":23400,"Rapid City":-25200,"Rasht":12600,"Rawalpindi":18000,"Recife":-10800,"Resistencia":-10800,"Reunion":14400,"Reykjavik":0,"Reynosa":-21600,"Rhode Island":-18000,"Ribeirao Preto":-7200,"Ribeirao das Neves":-7200,"Riga":7200,"Rio de Janeiro":-7200,"Riyadh":10800,"Road Town":-14400,"Roma":3600,"Romania":7200,"Rome":3600,"Rosario":-10800,"Roseau":-14400,"Rostov-na-Donu":10800,"Rotterdam":3600,"Russia - Moscow":10800,"Rwanda":7200,"Ryazan'":10800,"Sacramento":-28800,"Sagamihara":32400,"Saharanpur":19800,"Saint Barthélemy":-14400,"Saint George's":-14400,"Saint Helena":0,"Saint Helier":0,"Saint John's":-14400,"Saint Kitts and Nevis":-14400,"Saint Louis":-21600,"Saint Lucia":-14400,"Saint Martin":-14400,"Saint Peter Port":0,"Saint Petersburg":10800,"Saint Pierre and Miquelon":-10800,"Saint Vincent and the Grenadines":-14400,"Saint-Denis":14400,"Saint-Pierre":-10800,"Saitama":32400,"Sakai":32400,"Salem":19800,"Salt Lake City":-25200,"Salta":-10800,"Saltillo":-21600,"Salvador":-10800,"Salzburg":3600,"Samara":14400,"Samoa":50400,"Samsun":7200,"Samut Prakan":25200,"San Antonio":-21600,"San Diego":-28800,"San Francisco":-28800,"San Jose":-28800,"San Luis Potosi":-21600,"San Marino":3600,"San Miguel de Tucuman":-10800,"San Nicolas de los Garzas":-21600,"San Pedro Sula":-21600,"San Salvador":-21600,"Sanaa":10800,"Sandakan":28800,"Sanliurfa":7200,"Santa Cruz de la Sierra":-14400,"Santa Fe de la Vera Cruz":-10800,"Santa Marta":-18000,"Santiago":-10800,"Santiago de Cuba":-18000,"Santiago de los Caballeros":-14400,"Santo Andre":-7200,"Santo Domingo":-14400,"Santos":-7200,"Sao Bernardo do Campo":-7200,"Sao Joao de Meriti":-7200,"Sao Jose do Rio Preto":-7200,"Sao Jose dos Campos":-7200,"Sao Luis":-10800,"Sao Paulo":-7200,"Sao Tome":0,"Sao Tome and Principe":0,"Sapporo":32400,"Sarajevo":3600,"Saratov":10800,"Sargodha":18000,"Saudi Arabia":10800,"Seattle":-28800,"Semarang":25200,"Sendai":32400,"Senegal":0,"Seoul":32400,"Serbia":3600,"Seremban":28800,"Serra":-7200,"Sevastopol'":10800,"Sevilla":3600,"Seychelles":14400,"Shah Alam":28800,"Shanghai":28800,"Shantou":28800,"Shaoguan":28800,"Shaoxing":28800,"Sharjah":14400,"Shashi":28800,"Sheffield":0,"Shenyang":28800,"Shenzhen":28800,"Shihezi":21600,"Shijiazhuang":28800,"Shiliguri":19800,"Shimminatocho":32400,"Shiraz":12600,"Shivaji Nagar":19800,"Shizuoka":32400,"Shuangyashan":28800,"Shymkent":21600,"Sialkot":18000,"Sierra Leone":0,"Singapore":28800,"Sioux Falls":-21600,"Siping":28800,"Situbondo":25200,"Skopje":3600,"Slovakia":3600,"Slovenia":3600,"Sofia":7200,"Sokoto":3600,"Solapur":19800,"Solomon Islands":39600,"Somalia":10800,"Songnam":32400,"Sorocaba":-7200,"South Africa":7200,"South Boston":-18000,"South Carolina":-18000,"South Dakota - Rapid City":-25200,"South Dakota - Sioux Falls":-21600,"South Georgia and the South Sandwich Islands":-7200,"South Korea":32400,"Soweto":7200,"Spain":3600,"Sri Lanka":19800,"Srinagar":19800,"Stanley":-10800,"Stockholm":3600,"Strasbourg":3600,"Stuttgart":3600,"Sucre":-14400,"Sudan":10800,"Suez":7200,"Sukkur":18000,"Sultanah":10800,"Surabaya":25200,"Surakarta":25200,"Surat":19800,"Suriname":-10800,"Suva":46800,"Suwon":32400,"Suzhou":28800,"Svalbard and Jan Mayen":3600,"Swaziland":7200,"Sweden":3600,"Switzerland":3600,"Sydney":39600,"Syria":7200,"Szczecin":3600,"T'ai-chung-shih":28800,"Ta`izz":10800,"Tabriz":12600,"Tabuk":10800,"Taegu":32400,"Taejon":32400,"Tai'an":28800,"Tainan City":28800,"Taipei":28800,"Taiwan":28800,"Taiyuan":28800,"Taizhou":28800,"Tajikistan":18000,"Tallinn":7200,"Tangerang":25200,"Tanggu":28800,"Tangier":0,"Tangshan":28800,"Tanjungkarang-Telukbetung":25200,"Tanta":7200,"Tanzania":10800,"Tashkent":18000,"Tbilisi":14400,"Tegucigalpa":-21600,"Tehran":12600,"Tel Aviv-Yafo":7200,"Tembisa":7200,"Teni":19800,"Tennessee - Knoxville":-18000,"Tennessee - Memphis":-21600,"Tennessee - Nashville":-21600,"Teresina":-10800,"Texas - El Paso":-25200,"Texas - Houston":-21600,"Thailand":25200,"Thane":19800,"Thanh pho Ho Chi Minh":25200,"The Valley":-14400,"Thimphu":21600,"Thiruvananthapuram":19800,"Tianjin":28800,"Tijuana":-28800,"Tirana":3600,"Tiruchchirappalli":19800,"Tirunelveli":19800,"Tiruppur":19800,"Tlalnepantla":-21600,"Tlaquepaque":-21600,"Togo":0,"Tokelau":46800,"Tokyo":32400,"Tol'yatti":14400,"Toluca":-21600,"Tomsk":25200,"Tonala":-21600,"Tonga":46800,"Torino":3600,"Toronto":-18000,"Torreon":-21600,"Torshavn":0,"Toulouse":3600,"Toyohashi":32400,"Toyonaka":32400,"Trinidad and Tobago":-14400,"Tripoli":7200,"Trujillo":-18000,"Tucson":-25200,"Tula":10800,"Tulsa":-21600,"Tunis":3600,"Tunisia":3600,"Turkey":7200,"Turkmenistan":18000,"Turks and Caicos Islands":-14400,"Tuvalu":43200,"Tuxtla Gutierrez":-21600,"Tver'":10800,"Tyumen'":18000,"U.S. Virgin Islands":-14400,"Uberlandia":-7200,"Udaipur":19800,"Ufa":18000,"Uganda":10800,"Uijongbu":32400,"Ujjain":19800,"Ukraine":7200,"Ul'yanovsk":10800,"Ulaanbaatar":28800,"Ulhasnagar":19800,"Ulsan":32400,"United Arab Emirates":14400,"United Kingdom":0,"Uruguay":-10800,"Urumqi":21600,"Utah":-25200,"Utsunomiya":32400,"Uzbekistan":18000,"Vadodara":19800,"Vaduz":3600,"Valletta":3600,"Van":7200,"Vancouver":-28800,"Vanuatu":39600,"Vatican":3600,"Vatican City":3600,"Venezuela":-16200,"Venice":3600,"Veracruz":-21600,"Vereeniging":7200,"Vermont":-18000,"Victoria":14400,"Vienna":3600,"Vientiane":25200,"Vietnam":25200,"Vijayawada":19800,"Vila Velha":-7200,"Villa Nueva":-21600,"Vilnius":7200,"Virginia":-18000,"Virginia Beach":-18000,"Vishakhapatnam":19800,"Vladivostok":36000,"Volgograd":10800,"Voronezh":10800,"Wallis and Futuna":43200,"Warangal":19800,"Warri":3600,"Warsaw":3600,"Washington":-18000,"Washington - Seattle":-28800,"Weifang":28800,"Welkom":7200,"Wellington":46800,"Wenzhou":28800,"West Virginia":-18000,"Western Sahara":0,"Wichita":-21600,"Willemstad":-14400,"Wilmington":-18000,"Windhoek":7200,"Winnipeg":-21600,"Wisconsin":-21600,"Wroclaw":3600,"Wuhan":28800,"Wuhu":28800,"Wuxi":28800,"Wyoming":-25200,"Xi'an":28800,"Xiamen":28800,"Xiangfan":28800,"Xiangtan":28800,"Xianyang":28800,"Xingtai":28800,"Xining":28800,"Xinpu":28800,"Xinxiang":28800,"Xinyang":28800,"Xuanhua":28800,"Xuchang":28800,"Xuzhou":28800,"Yamoussoukro":0,"Yancheng":28800,"Yangjiang":28800,"Yangquan":28800,"Yangzhou":28800,"Yantai":28800,"Yaounde":3600,"Yaroslavl'":10800,"Yazd":12600,"Yekaterinburg":18000,"Yemen":10800,"Yerevan":14400,"Yichang":28800,"Yinchuan":28800,"Yingkou":28800,"Yogyakarta":25200,"Yokohama":32400,"Yokosuka":32400,"Yono":32400,"Yunfu":28800,"Zagreb":3600,"Zagreb - Centar":3600,"Zahedan":12600,"Zambia":7200,"Zamboanga":28800,"Zanzibar":10800,"Zapopan":-21600,"Zaporizhzhya":7200,"Zaragoza":3600,"Zaria":3600,"Zhangjiakou":28800,"Zhangzhou":28800,"Zhanjiang":28800,"Zhengzhou":28800,"Zhenjiang":28800,"Zhoukou":28800,"Zhuhai":28800,"Zhumadian":28800,"Zhuzhou":28800,"Zibo":28800,"Zigong":28800,"Zimbabwe":7200,"Zunyi":28800,"Zurich":3600,"`Adan":10800,"vina causino":-10800};
  var abbreviations = {"Aba":"WAT","Abadan":"IRST","Abeokuta":"WAT","Abidjan":"GMT","Abobo":"GMT","Abomey-Calavi":"WAT","Abu Dhabi":"GST","Abu Ghurayb":"AST","Abuja":"WAT","Acapulco de Juarez":"CST","Accra":"GMT","Ad Dammam":"AST","Adamstown":"PST","Adana":"EET","Addis Ababa":"EAT","Adelaide":"ACDT","Afghanistan":"AFT","Agadir":"WET","Agra":"IST","Aguascalientes":"CST","Ahmadabad":"IST","Ahvaz":"IRST","Ajmer":"IST","Akola":"IST","Akure":"WAT","Al Basrah":"AST","Al Basrah al Qadimah":"AST","Al Hudaydah":"AST","Al Jizah":"EET","Al Mahallah al Kubra":"EET","Al Mansurah":"EET","Al Mawsil al Jadidah":"AST","Al Ubayyid":"EAT","Al `Ayn":"GST","Alabama":"CST","Aland Islands":"EET","Alaska":"AKST","Albania":"CET","Albuquerque":"MST","Aleppo":"EET","Alexandria":"EET","Algeria":"CET","Algiers":"CET","Aligarh":"IST","Allahabad":"IST","Almaty":"ALMT","Alofi":"NUT","Amagasaki":"JST","American Samoa":"SST","Amman":"EET","Amravati":"IST","Amritsar":"IST","Amsterdam":"CET","An Najaf":"AST","An Nasiriyah":"AST","Ananindeua":"BRT","Anchorage":"AKST","Andorra":"CET","Andorra la Vella":"CET","Angola":"WAT","Anguilla":"AST","Ankara":"EET","Ansan":"KST","Anshan":"CST","Antalya":"EET","Antananarivo":"EAT","Antarctica":"NZDT","Antigua and Barbuda":"AST","Antipolo":"PHT","Antwerp":"CET","Aomen":"CST","Apia":"WSDT","Aracaju":"BRT","Arak":"IRST","Arbil":"AST","Ardabil":"IRST","Arequipa":"PET","Argentina":"ART","Arizona":"MST","Arkansas":"CST","Armenia":"AMT","Aruba":"AST","As Sulaymaniyah":"AST","Asansol":"IST","Ashgabat":"TMT","Asmara":"EAT","Astana":"QYZT","Astrakhan'":"MSK","Asuncion":"PYST","Asyut":"EET","At Ta'if":"AST","Athens":"EET","Atlanta":"EST","Auckland":"NZDT","Aurangabad":"IST","Austin":"CST","Austria":"CET","Avarua":"CKT","Az Zarqa'":"EET","Azadshahr":"IRST","Azerbaijan":"AZT","Baghdad":"AST","Bahamas":"EST","Bahawalpur":"PKT","Bahrain":"AST","Bairiki":"GILT","Baku":"AZT","Balikpapan":"WITA","Baltimore":"EST","Bamako":"GMT","Bamenda":"WAT","Bandar Seri Begawan":"BNT","Bandung":"WIB","Banghazi":"EET","Bangkok":"ICT","Bangladesh":"BDT","Bangui":"WAT","Banjarmasin":"WITA","Banjul":"GMT","Baoding":"CST","Baotou":"CST","Barbados":"AST","Barcelona":"CET","Bareilly":"IST","Barnaul":"OMST","Barquisimeto":"VET","Barranquilla":"COT","Basse-Terre":"AST","Basseterre":"AST","Beijing":"CST","Beira":"CAT","Beirut":"EET","Bekasi":"WIB","Belarus":"MSK","Belem":"BRT","Belford Roxo":"BRST","Belgaum":"IST","Belgium":"CET","Belgrade":"CET","Belize":"CST","Bello":"COT","Belmopan":"CST","Belo Horizonte":"BRST","Benares":"IST","Bengaluru":"IST","Bengbu":"CST","Benin":"WAT","Benin-City":"WAT","Benoni":"SAST","Benxi":"CST","Berlin":"CET","Bermuda":"AST","Bern":"CET","Betim":"BRST","Bhatpara":"IST","Bhavnagar":"IST","Bhilai":"IST","Bhiwandi":"IST","Bhopal":"IST","Bhubaneshwar":"IST","Bhutan":"BTT","Bien Hoa":"ICT","Bikaner":"IST","Billings":"MST","Bishkek":"KGT","Bissau":"GMT","Blantyre":"CAT","Bloemfontein":"SAST","Bochum":"CET","Bochum-Hordel":"CET","Bogor":"WIB","Bogota":"COT","Boise":"MST","Bokaro":"IST","Boksburg":"SAST","Bolivia":"BOT","Bologna":"CET","Bosnia and Herzegovina":"CET","Boston":"EST","Botswana":"CAT","Bouake":"GMT","Boumerdas":"CET","Bouvet Island":"CET","Brasilia":"BRST","Bratislava":"CET","Brazil - Sao Paulo":"BRST","Brazzaville":"WAT","Bremen":"CET","Bridgeport":"EST","Bridgetown":"AST","Brisbane":"AEST","Bristol":"GMT","British Indian Ocean Territory":"IOT","British Virgin Islands":"AST","Brooklyn":"EST","Brunei":"BNT","Brussels":"CET","Bryansk":"MSK","Bucaramanga":"COT","Bucuresti":"EET","Budapest":"CET","Buenos Aires":"ART","Bujumbura":"CAT","Bulawayo":"CAT","Bulgaria":"EET","Bur Sa`id":"EET","Buraydah":"AST","Burkina Faso":"GMT","Burlington":"EST","Bursa":"EET","Burundi":"CAT","Cagayan de Oro":"PHT","Cairo":"EET","Calabar":"WAT","Calcutta":"IST","Calgary":"MST","Cali":"COT","Calicut":"IST","California":"PST","Callao":"PET","Camayenne":"GMT","Cambodia":"ICT","Cameroon":"WAT","Campinas":"BRST","Campo Grande":"AMST","Campos":"BRST","Canada - Calgary":"MST","Canada - Edmonton":"MST","Canada - Halifax":"AST","Canada - Montreal":"EST","Canada - Quebec":"EST","Canada - Toronto":"EST","Canada - Vancouver":"PST","Canada - Winnipeg":"CST","Canberra":"AEDT","Cancun":"EST","Cangzhou":"CST","Cankaya":"EET","Cape Town":"SAST","Cape Verde":"CVT","Caracas":"VET","Carrefour":"EST","Cartagena":"COT","Casablanca":"WET","Castries":"AST","Caxias do Sul":"BRST","Cayenne":"GFT","Cayman Islands":"EST","Cebu City":"PHT","Central African Republic":"WAT","Ch'angwon":"KST","Ch'ongju":"KST","Chad":"WAT","Chandigarh":"IST","Changchun":"CST","Changde":"CST","Changsha":"CST","Changzhi":"CST","Changzhou":"CST","Chaoyang":"CST","Chaozhou":"CST","Charleston":"EST","Charlotte":"EST","Cheboksary":"MSK","Cheju":"KST","Chelyabinsk":"YEKT","Chengde":"CST","Chengdu":"CST","Chennai":"IST","Cheyenne":"MST","Chi-lung":"CST","Chiba":"JST","Chicago":"CST","Chiclayo":"PET","Chihuahua":"MST","Chile":"CLT","China":"CST","Chisinau":"EET","Chittagong":"BDT","Chongqing":"CST","Chonju":"KST","Christchurch":"NZDT","Christmas Island":"CXT","Cimahi":"WIB","Ciudad Guayana":"VET","Ciudad Juarez":"MST","Ciudad Lopez Mateos":"CST","Ciudad Nezahualcoyotl":"CST","Cleveland":"EST","Cochabamba":"BOT","Cochin":"IST","Cocos Islands":"CCT","Coimbatore":"IST","Colombia":"COT","Colombo":"IST","Colorado":"MST","Columbia":"EST","Columbus":"EST","Comilla":"BDT","Comoros":"EAT","Conakry":"GMT","Congo - Kinshasa":"WAT","Congo - Lubumbashi":"CAT","Connecticut":"EST","Constantine":"CET","Contagem":"BRST","Cook Islands":"CKT","Copenhagen":"CET","Cordoba":"ART","Costa Rica":"CST","Cotonou":"WAT","Croatia":"CET","Cuautitlan Izcalli":"CST","Cuba":"CST","Cucuta":"COT","Cuiaba":"AMST","Culiacan":"MST","Curitiba":"BRST","Cuttack":"IST","Cyprus":"EET","Czech Republic":"CET","Da Nang":"ICT","Dakar":"GMT","Dalian":"CST","Dallas":"CST","Damascus":"EET","Dandong":"CST","Dar es Salaam":"EAT","Dasmarinas":"PHT","Datong":"CST","Davao":"PHT","Dayan":"CST","Dehra Dun":"IST","Delaware":"EST","Delhi":"IST","Delmas 73":"EST","Democratic Republic of the Congo":"CAT","Den Haag":"CET","Denmark":"CET","Denpasar":"WITA","Denver":"MST","Depok":"WIB","Des Moines":"CST","Detroit":"EST","Dezhou":"CST","Dhaka":"BDT","Diadema":"BRST","Diego Garcia":"IOT","Dili":"TLT","Diyarbakir":"EET","Djibouti":"EAT","Dnipropetrovsk":"EET","Dodoma":"EAT","Doha":"AST","Dominica":"AST","Dominican Republic":"AST","Donets'k":"EET","Dongguan":"CST","Dortmund":"CET","Douala":"WAT","Douglas":"GMT","Dresden":"CET","Dubai":"GST","Dublin":"GMT","Duisburg":"CET","Duque de Caxias":"BRST","Durango":"CST","Durban":"SAST","Durgapur":"IST","Dushanbe":"TJT","Dusseldorf":"CET","East Timor":"TLT","Ecatepec":"CST","Ecuador":"ECT","Edinburgh":"GMT","Edmonton":"MST","Egypt":"EET","El Paso":"MST","El Salvador":"CST","England":"GMT","Enugu":"WAT","Equatorial Guinea":"WAT","Eritrea":"EAT","Erzurum":"EET","Esfahan":"IRST","Eskisehir":"EET","Essen":"CET","Estonia":"EET","Ethiopia":"EAT","Faisalabad":"PKT","Falkland Islands":"FKST","Fargo":"CST","Faridabad":"IST","Faroe Islands":"WET","Feira de Santana":"BRT","Fes":"WET","Fiji":"FJST","Finland":"EET","Florence":"CET","Florianopolis":"BRST","Florida - Miami":"EST","Florida - Pensacola":"CST","Flying Fish Cove":"CXT","Fort Worth":"CST","Fort-de-France":"AST","Fortaleza":"BRT","Foshan":"CST","France":"CET","Frankfurt am Main":"CET","Freetown":"GMT","French Guiana":"GFT","French Polynesia":"MART","French Southern Territories":"TFT","Fresno":"PST","Fujisawa":"JST","Fukuoka":"JST","Fukuyama":"JST","Funabashi":"JST","Funafuti":"TVT","Fushun":"CST","Fuxin":"CST","Fuzhou":"CST","Gabon":"WAT","Gaborone":"CAT","Gambia":"GMT","Garoua":"WAT","Gaya":"IST","Gaza":"EET","Gaziantep":"EET","Gdansk":"CET","Genova":"CET","George Town":"EST","Georgetown":"GYT","Georgia (Country)":"GET","Georgia - United States":"EST","Germany":"CET","Ghana":"GMT","Ghaziabad":"IST","Gibraltar":"CET","Gifu":"JST","Glasgow":"GMT","Goeteborg":"CET","Goiania":"BRST","Gold Coast":"AEST","Grand Dakar":"GMT","Grand Turk":"AST","Great Britain":"GMT","Greece":"EET","Greenland - Nuuk":"WGT","Grenada":"AST","Grytviken":"GST","Guadalajara":"CST","Guadalupe":"CST","Guadeloupe":"AST","Guam":"ChST","Guangzhou":"CST","Guarulhos":"BRST","Guatemala":"CST","Guatemala City":"CST","Guayaquil":"ECT","Guernsey":"GMT","Guilin":"CST","Guinea":"GMT","Guinea-Bissau":"GMT","Guiyang":"CST","Gujranwala":"PKT","Gulbarga":"IST","Guli":"CST","Guntur":"IST","Gustavia":"AST","Guwahati":"IST","Guyana":"GYT","Gwalior":"IST","Ha Noi":"ICT","Hachioji":"JST","Hagatna":"ChST","Haikou":"CST","Haiphong":"ICT","Haiti":"EST","Hamadan":"IRST","Hamah":"EET","Hamamatsu":"JST","Hamburg":"CET","Hamhung":"KST","Hamilton":"EST","Handan":"CST","Hangzhou":"CST","Hannover":"CET","Haora":"IST","Harare":"CAT","Harbin":"CST","Hargeysa":"EAT","Havana":"CST","Hawaii":"HST","Heard Island and McDonald Islands":"AWST","Hefei":"CST","Hegang":"CST","Helsinki":"EET","Hengshui":"CST","Hengyang":"CST","Hermosillo":"MST","Himeji":"JST","Hims":"EET","Hirakata":"JST","Hiroshima":"JST","Hohhot":"CST","Homyel'":"MSK","Honduras":"CST","Hong Kong":"HKT","Honiara":"SBT","Honolulu":"HST","Houston":"CST","Hsin-chu-shih":"CST","Huaibei":"CST","Huainan":"CST","Huaiyin":"CST","Huancayo":"PET","Huangshi":"CST","Hubli":"IST","Hungary":"CET","Ibadan":"WAT","Ibague":"COT","Iceland":"GMT","Ichikawa":"JST","Idaho - Boise":"MST","Illinois":"CST","Iloilo":"PHT","Ilorin":"WAT","Inch'on":"KST","India":"IST","Indiana - Indianapolis":"EST","Indianapolis":"EST","Indonesia":"WITA","Indore":"IST","Iowa":"CST","Ipoh":"MYT","Iquitos":"PET","Iran":"IRST","Iraq":"AST","Ireland":"GMT","Irkutsk":"IRKT","Islamabad":"PKT","Isle of Man":"GMT","Israel":"IST","Istanbul":"EET","Italy":"CET","Ivanovo":"MSK","Ivory Coast":"GMT","Izhevsk":"SAMT","Izmir":"EET","Jabalpur":"IST","Jaboatao":"BRT","Jaboatao dos Guararapes":"BRT","Jackson":"CST","Jacksonville":"EST","Jaipur":"IST","Jakarta":"WIB","Jalandhar":"IST","Jalapa Enriquez":"CST","Jalgaon":"IST","Jamaica":"EST","Jambi":"WIB","Jamestown":"GMT","Jammu":"IST","Jamnagar":"IST","Jamshedpur":"IST","Japan":"JST","Jersey":"GMT","Jerusalem":"IST","Jhansi":"IST","Jiamusi":"CST","Jiangmen":"CST","Jiaojiang":"CST","Jiaozuo":"CST","Jiaxing":"CST","Jiddah":"AST","Jieyang":"CST","Jilin":"CST","Jinan":"CST","Jining":"CST","Jinzhou":"CST","Jixi":"CST","Joao Pessoa":"BRT","Jodhpur":"IST","Johannesburg":"SAST","Johor Bahru":"MYT","Joinville":"BRST","Jordan":"EET","Jos":"WAT","Juan Dolio":"AST","Juiz de Fora":"BRST","Kabul":"AFT","Kaduna":"WAT","Kagoshima":"JST","Kahramanmaras":"EET","Kahriz":"IRST","Kaifeng":"CST","Kaliningrad":"EET","Kalyan":"IST","Kampala":"EAT","Kampung Baru Subang":"MYT","Kananga":"CAT","Kanazawa":"JST","Kandahar":"AFT","Kano":"WAT","Kanpur":"IST","Kansas - Wichita":"CST","Kansas City":"CST","Kao-hsiung":"CST","Karachi":"PKT","Karagandy":"AQTT","Karaj":"IRST","Karbala'":"AST","Kassala":"EAT","Kathmandu":"NPT","Katsina":"WAT","Kaunas":"EET","Kawaguchi":"JST","Kawasaki":"JST","Kayseri":"EET","Kazakhstan - Almaty":"ALMT","Kazan'":"MSK","Kemerovo":"KRAT","Kentucky - Lexington":"EST","Kentucky - Lexington-Fayette":"EST","Kentucky - Louisville":"EST","Kentucky - Owensboro":"CST","Kenya":"EAT","Kerman":"IRST","Kermanshah":"IRST","Khabarovsk":"VLAT","Khabarovsk Vtoroy":"VLAT","Khamis Mushayt":"AST","Kharkiv":"EET","Khartoum":"EAT","Khmel'nyts'kyy":"EET","Khulna":"BDT","Kiev":"EET","Kigali":"CAT","Kingston":"EST","Kingstown":"AST","Kinshasa":"WAT","Kirkuk":"AST","Kirov":"MSK","Kisangani":"CAT","Kitakyushu":"JST","Kitchener":"EST","Kitwe":"CAT","Klang":"MYT","Knoxville":"EST","Kobe":"JST","Koeln":"CET","Kolhapur":"IST","Kolwezi":"CAT","Konya":"EET","Korba":"IST","Koror":"PWT","Kota":"IST","Kota Kinabalu":"MYT","Kotli":"PKT","Kousseri":"WAT","Kowloon":"HKT","Krakow":"CET","Krasnodar":"MSK","Krasnoyarsk":"KRAT","Krugersdorp":"SAST","Kryvyy Rih":"EET","Kuala Lumpur":"MYT","Kuching":"MYT","Kumamoto":"JST","Kumasi":"GMT","Kunming":"CST","Kurashiki":"JST","Kursk":"MSK","Kuwait":"AST","Kwangju":"KST","Kyoto":"JST","Kyrgyzstan":"KGT","L'viv":"EET","La Paz":"BOT","La Plata":"ART","Lagos":"WAT","Lahore":"PKT","Langfang":"CST","Lanzhou":"CST","Laos":"ICT","Las Palmas de Gran Canaria":"WET","Las Pavas":"COT","Las Vegas":"PST","Latvia":"EET","Lebanon":"EET","Leeds":"GMT","Leipzig":"CET","Leon":"CST","Lesotho":"SAST","Lexington":"EST","Lexington-Fayette":"EST","Liaoyang":"CST","Liaoyuan":"CST","Liberia":"GMT","Libreville":"WAT","Libya":"EET","Liechtenstein":"CET","Likasi":"CAT","Lilongwe":"CAT","Lima":"PET","Lincoln":"CST","Lipetsk":"MSK","Lisbon":"WET","Lithuania":"EET","Little Rock":"CST","Liuyang":"CST","Liverpool":"GMT","Ljubljana":"CET","Lobamba":"SAST","Lodz":"CET","Lome":"GMT","London":"GMT","Londrina":"BRST","Long Beach":"PST","Longyearbyen":"CET","Los Angeles":"PST","Louisiana":"CST","Louisville":"EST","Luancheng":"CST","Luanda":"WAT","Lubumbashi":"CAT","Lucknow":"IST","Ludhiana":"IST","Luhans'k":"EET","Luohe":"CST","Luoyang":"CST","Luqiaozhen":"CST","Lusaka":"CAT","Luxembourg":"CET","Luxor":"EET","Lyon":"CET","Macao":"CST","Macedonia":"CET","Maceio":"BRT","Machida":"JST","Madagascar":"EAT","Madrid":"CET","Madurai":"IST","Magnitogorsk":"YEKT","Maiduguri":"WAT","Maine":"EST","Majuro":"MHT","Makassar":"WITA","Makhachkala":"MSK","Makiyivka":"EET","Malabo":"WAT","Malaga":"CET","Malang":"WIB","Malatya":"EET","Malawi":"CAT","Malaysia":"MYT","Maldives":"MVT","Male":"MVT","Malegaon":"IST","Mali":"GMT","Malta":"CET","Mamoudzou":"EAT","Mamuju":"WITA","Manado":"WITA","Managua":"CST","Manama":"AST","Manaus":"AMT","Mandalay":"MMT","Mangalore":"IST","Manila":"PHT","Mansilingan":"PHT","Maputo":"CAT","Mar del Plata":"ART","Maracaibo":"VET","Mariupol'":"EET","Marrakech":"WET","Marseille":"CET","Marshall Islands":"MHT","Martinique":"AST","Maryland":"EST","Maseru":"SAST","Mashhad":"IRST","Masina":"WAT","Massachusetts":"EST","Matamoros":"CST","Matola":"CAT","Matsudo":"JST","Maturin":"VET","Maua":"BRST","Mauritania":"GMT","Mauritius":"MUT","Mawlamyine":"MMT","Mayotte":"EAT","Mbabane":"SAST","Mbuji-Mayi":"CAT","Mecca":"AST","Medan":"WIB","Medellin":"COT","Medina":"AST","Meerut":"IST","Meknes":"WET","Melbourne":"AEDT","Melekeok":"PWT","Memphis":"CST","Mendoza":"ART","Mercin":"EET","Merida":"CST","Mesa":"MST","Mexicali":"PST","Mexico - Mexico City":"CST","Mexico City":"CST","Miami":"EST","Michigan":"EST","Milano":"CET","Milwaukee":"CST","Minneapolis":"CST","Minnesota":"CST","Minsk":"MSK","Misratah":"EET","Mississippi":"CST","Missouri":"CST","Mixco":"CST","Mogadishu":"EAT","Moldova":"EET","Mombasa":"EAT","Monaco":"CET","Mongolia":"ULAT","Monrovia":"GMT","Montana":"MST","Montenegro":"CET","Monterrey":"CST","Montevideo":"UYT","Montreal":"EST","Montserrat":"AST","Moradabad":"IST","Morelia":"CST","Morocco":"WET","Moroni":"EAT","Moscow":"MSK","Mosul":"AST","Mozambique":"CAT","Muang Phonsavan":"ICT","Mudanjiang":"CST","Muenchen":"CET","Multan":"PKT","Mumbai":"IST","Munich":"CET","Murcia":"CET","Muscat":"GST","Mwanza":"EAT","Myanmar":"MMT","Mykolayiv":"EET","Mysore":"IST","N'Djamena":"WAT","Naberezhnyye Chelny":"MSK","Nagasaki":"JST","Nagoya":"JST","Nagpur":"IST","Nairobi":"EAT","Namangan":"UZT","Namibia":"WAST","Namp'o":"KST","Nampula":"CAT","Nanchang":"CST","Nanchong":"CST","Nangi":"IST","Nanjing":"CST","Nanning":"CST","Nantong":"CST","Napoli":"CET","Nashville":"CST","Nasik":"IST","Nassau":"EST","Natal":"BRT","Naucalpan de Juarez":"CST","Nauru":"NRT","Nay Pyi Taw":"MMT","Ndola":"CAT","Nebraska - Lincoln":"CST","Nebraska - Omaha":"CST","Neijiang":"CST","Nellore":"IST","Nepal":"NPT","Nerima":"JST","Netherlands":"CET","Netherlands Antilles":"AST","Nevada":"PST","New Caledonia":"NCT","New Delhi":"IST","New Hampshire":"EST","New Jersey":"EST","New Kingston":"EST","New Mexico":"MST","New Orleans":"CST","New South Memphis":"CST","New York":"EST","New Zealand":"NZDT","Newark":"EST","Niamey":"WAT","Nicaragua":"CST","Nicosia":"EET","Niger":"WAT","Nigeria":"WAT","Niigata":"JST","Ningbo":"CST","Nishinomiya":"JST","Niteroi":"BRST","Niue":"NUT","Nizhniy Novgorod":"MSK","Nizhniy Tagil":"YEKT","Norfolk Island":"NFT","North Carolina":"EST","North Dakota - Fargo":"CST","North Korea":"KST","North York":"EST","Northern Mariana Islands":"ChST","Norway":"CET","Nouakchott":"GMT","Noumea":"NCT","Nova Iguacu":"BRST","Novokuznetsk":"KRAT","Novosibirsk":"NOVT","Nuernberg":"CET","Nuku`alofa":"TOT","Nuuk":"WGT","Oakland":"PST","Odesa":"MSK","Ohio":"EST","Oita":"JST","Okayama":"JST","Okene":"WAT","Oklahoma":"CST","Oklahoma City":"CST","Omaha":"CST","Oman":"GST","Omdurman":"EAT","Omsk":"OMST","Onitsha":"WAT","Oran":"CET","Oranjestad":"AST","Oregon - Portland":"PST","Orenburg":"YEKT","Orumiyeh":"IRST","Osaka":"JST","Osasco":"BRST","Oslo":"CET","Ottawa":"EST","Ouagadougou":"GMT","Oujda":"WET","Owensboro":"CST","Oyo":"WAT","Padang":"WIB","Pago Pago":"SST","Pakistan":"PKT","Palau":"PWT","Palembang":"WIB","Palermo":"CET","Palestinian Territory":"EET","Palikir":"PONT","Palma":"CET","Panama":"EST","Panihati":"IST","Panshan":"CST","Panzhihua":"CST","Papeete":"TAHT","Papua New Guinea":"PGT","Paraguay":"PYST","Paramaribo":"SRT","Paris":"CET","Pasto":"COT","Patna":"IST","Pennsylvania":"EST","Pensacola":"CST","Penza":"MSK","Pereira":"COT","Perm'":"YEKT","Perth":"AWST","Peru":"PET","Peshawar":"PKT","Petaling Jaya":"MYT","Philadelphia":"EST","Philippines":"PHT","Phnom Penh":"ICT","Phoenix":"MST","Pietermaritzburg":"SAST","Pikine":"GMT","Pimpri":"IST","Pingdingshan":"CST","Pingxiang":"CST","Pitcairn":"PST","Plymouth":"AST","Podgorica":"CET","Pointe-Noire":"WAT","Poland":"CET","Ponce":"AST","Pontianak":"WIB","Port Elizabeth":"SAST","Port Harcourt":"WAT","Port Louis":"MUT","Port Moresby":"PGT","Port Sudan":"EAT","Port-Vila":"VUT","Port-au-Prince":"EST","Port-of-Spain":"AST","Porto Alegre":"BRST","Porto-Novo":"WAT","Portugal":"WET","Poznan":"CET","Praha":"CET","Praia":"CVT","Pretoria":"SAST","Pristina":"CET","Providence":"EST","Puch'on":"KST","Puebla de Zaragoza":"CST","Puerto Rico":"AST","Pune":"IST","Pusan":"KST","Putian":"CST","Pyongyang":"KST","Qaraghandy":"ALMT","Qatar":"AST","Qingdao":"CST","Qinhuangdao":"CST","Qiqihar":"CST","Qom":"IRST","Quebec":"EST","Queretaro":"CST","Quetta":"PKT","Quilmes":"ART","Quilon":"IST","Quito":"ECT","Ra's Bayrut":"EET","Rabat":"WET","Raipur":"IST","Rajkot":"IST","Rajshahi":"BDT","Ranchi":"IST","Rangoon":"MMT","Rapid City":"MST","Rasht":"IRST","Rawalpindi":"PKT","Recife":"BRT","Resistencia":"ART","Reunion":"RET","Reykjavik":"GMT","Reynosa":"CST","Rhode Island":"EST","Ribeirao Preto":"BRST","Ribeirao das Neves":"BRST","Riga":"EET","Rio de Janeiro":"BRST","Riyadh":"AST","Road Town":"AST","Roma":"CET","Romania":"EET","Rome":"CET","Rosario":"ART","Roseau":"AST","Rostov-na-Donu":"MSK","Rotterdam":"CET","Russia - Moscow":"MSK","Rwanda":"CAT","Ryazan'":"MSK","Sacramento":"PST","Sagamihara":"JST","Saharanpur":"IST","Saint Barthélemy":"AST","Saint George's":"AST","Saint Helena":"GMT","Saint Helier":"GMT","Saint John's":"AST","Saint Kitts and Nevis":"AST","Saint Louis":"CST","Saint Lucia":"AST","Saint Martin":"AST","Saint Peter Port":"GMT","Saint Petersburg":"MSK","Saint Pierre and Miquelon":"PMST","Saint Vincent and the Grenadines":"AST","Saint-Denis":"RET","Saint-Pierre":"PMST","Saitama":"JST","Sakai":"JST","Salem":"IST","Salt Lake City":"MST","Salta":"ART","Saltillo":"CST","Salvador":"BRT","Salzburg":"CET","Samara":"SAMT","Samoa":"WSDT","Samsun":"EET","Samut Prakan":"ICT","San Antonio":"CST","San Diego":"PST","San Francisco":"PST","San Jose":"PST","San Luis Potosi":"CST","San Marino":"CET","San Miguel de Tucuman":"ART","San Nicolas de los Garzas":"CST","San Pedro Sula":"CST","San Salvador":"CST","Sanaa":"AST","Sandakan":"MYT","Sanliurfa":"EET","Santa Cruz de la Sierra":"BOT","Santa Fe de la Vera Cruz":"ART","Santa Marta":"COT","Santiago":"CLT","Santiago de Cuba":"CST","Santiago de los Caballeros":"AST","Santo Andre":"BRST","Santo Domingo":"AST","Santos":"BRST","Sao Bernardo do Campo":"BRST","Sao Joao de Meriti":"BRST","Sao Jose do Rio Preto":"BRST","Sao Jose dos Campos":"BRST","Sao Luis":"BRT","Sao Paulo":"BRST","Sao Tome":"GMT","Sao Tome and Principe":"GMT","Sapporo":"JST","Sarajevo":"CET","Saratov":"MSK","Sargodha":"PKT","Saudi Arabia":"AST","Seattle":"PST","Semarang":"WIB","Sendai":"JST","Senegal":"GMT","Seoul":"KST","Serbia":"CET","Seremban":"MYT","Serra":"BRST","Sevastopol'":"MSK","Sevilla":"CET","Seychelles":"SCT","Shah Alam":"MYT","Shanghai":"CST","Shantou":"CST","Shaoguan":"CST","Shaoxing":"CST","Sharjah":"GST","Shashi":"CST","Sheffield":"GMT","Shenyang":"CST","Shenzhen":"CST","Shihezi":"XJT","Shijiazhuang":"CST","Shiliguri":"IST","Shimminatocho":"JST","Shiraz":"IRST","Shivaji Nagar":"IST","Shizuoka":"JST","Shuangyashan":"CST","Shymkent":"QYZT","Sialkot":"PKT","Sierra Leone":"GMT","Singapore":"SGT","Sioux Falls":"CST","Siping":"CST","Situbondo":"WIB","Skopje":"CET","Slovakia":"CET","Slovenia":"CET","Sofia":"EET","Sokoto":"WAT","Solapur":"IST","Solomon Islands":"SBT","Somalia":"EAT","Songnam":"KST","Sorocaba":"BRST","South Africa":"SAST","South Boston":"EST","South Carolina":"EST","South Dakota - Rapid City":"MST","South Dakota - Sioux Falls":"CST","South Georgia and the South Sandwich Islands":"GST","South Korea":"KST","Soweto":"SAST","Spain":"CET","Sri Lanka":"IST","Srinagar":"IST","Stanley":"FKST","Stockholm":"CET","Strasbourg":"CET","Stuttgart":"CET","Sucre":"BOT","Sudan":"EAT","Suez":"EET","Sukkur":"PKT","Sultanah":"AST","Surabaya":"WIB","Surakarta":"WIB","Surat":"IST","Suriname":"SRT","Suva":"FJST","Suwon":"KST","Suzhou":"CST","Svalbard and Jan Mayen":"CET","Swaziland":"SAST","Sweden":"CET","Switzerland":"CET","Sydney":"AEDT","Syria":"EET","Szczecin":"CET","T'ai-chung-shih":"CST","Ta`izz":"AST","Tabriz":"IRST","Tabuk":"AST","Taegu":"KST","Taejon":"KST","Tai'an":"CST","Tainan City":"CST","Taipei":"CST","Taiwan":"CST","Taiyuan":"CST","Taizhou":"CST","Tajikistan":"TJT","Tallinn":"EET","Tangerang":"WIB","Tanggu":"CST","Tangier":"WET","Tangshan":"CST","Tanjungkarang-Telukbetung":"WIB","Tanta":"EET","Tanzania":"EAT","Tashkent":"UZT","Tbilisi":"GET","Tegucigalpa":"CST","Tehran":"IRST","Tel Aviv-Yafo":"IST","Tembisa":"SAST","Teni":"IST","Tennessee - Knoxville":"EST","Tennessee - Memphis":"CST","Tennessee - Nashville":"CST","Teresina":"BRT","Texas - El Paso":"MST","Texas - Houston":"CST","Thailand":"ICT","Thane":"IST","Thanh pho Ho Chi Minh":"ICT","The Valley":"AST","Thimphu":"BTT","Thiruvananthapuram":"IST","Tianjin":"CST","Tijuana":"PST","Tirana":"CET","Tiruchchirappalli":"IST","Tirunelveli":"IST","Tiruppur":"IST","Tlalnepantla":"CST","Tlaquepaque":"CST","Togo":"GMT","Tokelau":"TKT","Tokyo":"JST","Tol'yatti":"SAMT","Toluca":"CST","Tomsk":"KRAT","Tonala":"CST","Tonga":"TOT","Torino":"CET","Toronto":"EST","Torreon":"CST","Torshavn":"WET","Toulouse":"CET","Toyohashi":"JST","Toyonaka":"JST","Trinidad and Tobago":"AST","Tripoli":"EET","Trujillo":"PET","Tucson":"MST","Tula":"MSK","Tulsa":"CST","Tunis":"CET","Tunisia":"CET","Turkey":"EET","Turkmenistan":"TMT","Turks and Caicos Islands":"AST","Tuvalu":"TVT","Tuxtla Gutierrez":"CST","Tver'":"MSK","Tyumen'":"YEKT","U.S. Virgin Islands":"AST","Uberlandia":"BRST","Udaipur":"IST","Ufa":"YEKT","Uganda":"EAT","Uijongbu":"KST","Ujjain":"IST","Ukraine":"EET","Ul'yanovsk":"MSK","Ulaanbaatar":"ULAT","Ulhasnagar":"IST","Ulsan":"KST","United Arab Emirates":"GST","United Kingdom":"GMT","Uruguay":"UYT","Urumqi":"XJT","Utah":"MST","Utsunomiya":"JST","Uzbekistan":"UZT","Vadodara":"IST","Vaduz":"CET","Valletta":"CET","Van":"EET","Vancouver":"PST","Vanuatu":"VUT","Vatican":"CET","Vatican City":"CET","Venezuela":"VET","Venice":"CET","Veracruz":"CST","Vereeniging":"SAST","Vermont":"EST","Victoria":"SCT","Vienna":"CET","Vientiane":"ICT","Vietnam":"ICT","Vijayawada":"IST","Vila Velha":"BRST","Villa Nueva":"CST","Vilnius":"EET","Virginia":"EST","Virginia Beach":"EST","Vishakhapatnam":"IST","Vladivostok":"VLAT","Volgograd":"MSK","Voronezh":"MSK","Wallis and Futuna":"WFT","Warangal":"IST","Warri":"WAT","Warsaw":"CET","Washington":"EST","Washington - Seattle":"PST","Weifang":"CST","Welkom":"SAST","Wellington":"NZDT","Wenzhou":"CST","West Virginia":"EST","Western Sahara":"WET","Wichita":"CST","Willemstad":"AST","Wilmington":"EST","Windhoek":"WAST","Winnipeg":"CST","Wisconsin":"CST","Wroclaw":"CET","Wuhan":"CST","Wuhu":"CST","Wuxi":"CST","Wyoming":"MST","Xi'an":"CST","Xiamen":"CST","Xiangfan":"CST","Xiangtan":"CST","Xianyang":"CST","Xingtai":"CST","Xining":"CST","Xinpu":"CST","Xinxiang":"CST","Xinyang":"CST","Xuanhua":"CST","Xuchang":"CST","Xuzhou":"CST","Yamoussoukro":"GMT","Yancheng":"CST","Yangjiang":"CST","Yangquan":"CST","Yangzhou":"CST","Yantai":"CST","Yaounde":"WAT","Yaroslavl'":"MSK","Yazd":"IRST","Yekaterinburg":"YEKT","Yemen":"AST","Yerevan":"AMT","Yichang":"CST","Yinchuan":"CST","Yingkou":"CST","Yogyakarta":"WIB","Yokohama":"JST","Yokosuka":"JST","Yono":"JST","Yunfu":"CST","Zagreb":"CET","Zagreb - Centar":"CET","Zahedan":"IRST","Zambia":"CAT","Zamboanga":"PHT","Zanzibar":"EAT","Zapopan":"CST","Zaporizhzhya":"EET","Zaragoza":"CET","Zaria":"WAT","Zhangjiakou":"CST","Zhangzhou":"CST","Zhanjiang":"CST","Zhengzhou":"CST","Zhenjiang":"CST","Zhoukou":"CST","Zhuhai":"CST","Zhumadian":"CST","Zhuzhou":"CST","Zibo":"CST","Zigong":"CST","Zimbabwe":"CAT","Zunyi":"CST","Zurich":"CET","`Adan":"AST","vina causino":"CLT"};
  var warnings = {"CEDT (Central European Daylight Time)":"Did you mean CET (Central European Time)?<br/>Europe currently observes CET, not CEDT.","Central European Daylight Time (CEDT)":"Did you mean CET (Central European Time)?<br/>Europe currently observes CET, not CEDT.","CEST (Central European Summer Time)":"Did you mean CET (Central European Time)?<br/>Europe currently observes CET, not CEST.","Central European Summer Time (CEST)":"Did you mean CET (Central European Time)?<br/>Europe currently observes CET, not CEST.","EDT (Eastern Daylight Time)":"Did you mean EST (Eastern Standard Time)?<br/>The Eastern United States currently observes EST, not EDT.","Eastern Daylight Time (EDT)":"Did you mean EST (Eastern Standard Time)?<br/>The Eastern United States currently observes EST, not EDT.","PDT (Pacific Daylight Time)":"Did you mean PST (Pacific Standard Time)?<br/>The Western United States currently observes PST, not PDT.","Pacific Daylight Time (PDT)":"Did you mean PST (Pacific Standard Time)?<br/>The Western United States currently observes PST, not PDT.","MDT (Mountain Daylight Time)":"Did you mean MST (Mountain Standard Time)?<br/>The Western United States currently observes MST, not MDT.","Mountain Daylight Time (MDT)":"Did you mean MST (Mountain Standard Time)?<br/>The Western United States currently observes MST, not MDT.","CDT (Central Daylight Time)":"Did you mean CST (Central Standard Time)?<br/>The United States currently observes CST, not CDT.","Central Daylight Time (CDT)":"Did you mean CST (Central Standard Time)?<br/>The United States currently observes CST, not CDT.","NZST (New Zealand Standard Time)":"Did you mean NZDT (New Zealand Daylight Time)?<br/>New Zealand currently observes NZDT, not NZST.","New Zealand Standard Time (NZST)":"Did you mean NZDT (New Zealand Daylight Time)?<br/>New Zealand currently observes NZDT, not NZST."};

if(!isDef(gmts) || !isDef(tznames) || !isDef(cities) || !isDef(warnings)) {
  var cities = {"Chicago":-18000, "New York":-14400, "EST (Eastern Standard Time)":-14400};
  var abbreviations = {"Chicago":"CST"};
  var warnings = {};
}


// Models
function SideModel() {
    this.view = null;
    this.warningView = null;
    this.time = null;
    this.context = null;
}
SideModel.prototype.getView = function() {
    return this.view;
}
SideModel.prototype.setViews = function(sideView, warningView) {
    this.view = sideView;
    this.warningView = warningView;
}
SideModel.prototype.getTime = function() {
    return this.time;
}
SideModel.prototype.setTime = function(s) {
    this.time = s;
    this.notify();
}
SideModel.prototype.getContext = function() {
    return this.context;
}
SideModel.prototype.setContext = function(s) {
    this.context = s;
    this.notify();
}
SideModel.prototype.getAbbreviation = function() {  // this returns undefined if there is no abbrevation
    return abbreviations[this.context];
}
SideModel.prototype.getOffset = function() {  // this returns undefined if there is no offset
    return convert_map[this.context];
}
SideModel.prototype.isLocal = function() {
    return this.context == LOCAL_TIME_STRING;
}
SideModel.prototype.notify = function() {
    if(this.view)
      this.view.update();
    if(this.warningView)
      this.warningView.update();
}
function Swap24Model() {
    this.view = null;
    this.is24 = false; // false means '12'
}
Swap24Model.prototype.getIs24 = function() {
    return this.is24;
}
Swap24Model.prototype.toggleFormat = function() {
    this.is24 = !this.is24;
    if(this.is24)
        cookie.time_format = '24h';
    else
        cookie.time_format = '12h';
    cookie.store();
    this.notify();
}
Swap24Model.prototype.setTo12 = function() {
    this.is24 = false;
    cookie.time_format = '12h';
    this.notify();
}
Swap24Model.prototype.setTo24 = function() {
    this.is24 = true;
    cookie.time_format = '24h';
    this.notify();
}
Swap24Model.prototype.setView = function(view) {
    this.view = view;
}
Swap24Model.prototype.notify = function() {
    if(this.view)
      this.view.update();
}

// Views
// param side must be '1' or '2'
function SideView(model, side) {
    this.model = model;
    this.timeElem        = document.getElementById('time'+side);
    this.contextElem     = document.getElementById('c'+side);
    this.timeInfoElem    = document.getElementById('time'+side+'i');
    this.contextInfoElem = document.getElementById('c'+side+'i');
    this.dirty = false;
}
SideView.prototype.getTimeValue = function() {
    return this.timeElem.value;
}
SideView.prototype.getContextValue = function() {
    return this.contextElem.value;
}
SideView.prototype.setTimeInfo = function(s) {
    this.timeInfoElem.innerHTML = s;
}
SideView.prototype.clearTimeInfo = function() {
    this.timeInfoElem.innerHTML = '';
}
SideView.prototype.disableTime = function() {
    this.timeElem.disabled = true;
    this.timeElem.className += 'disabled_color';
}
SideView.prototype.disableContext = function() {
    this.contextElem.disabled = true;
    this.contextElem.className += 'disabled_color';
}
SideView.prototype.getDirty = function() {
    return this.dirty;
}
SideView.prototype.setDirty = function() {
    this.dirty = true;
}
SideView.prototype.clearDirty = function(s) {
    this.dirty = false;
}
SideView.prototype.setTimeFormat = function(time_format) {
    var date = validTimeParse(this.getTimeValue());
    if(date) {
        var t = date.toString(time_format);
        this.model.setTime(t);
    }
}
SideView.prototype.update = function() {
    this.timeElem.value            = this.model.getTime();
    this.contextElem.value         = this.model.getContext();

    var s = '';
    if(this.model.getAbbreviation())
      s = this.model.getAbbreviation();
    this.contextInfoElem.innerHTML = s;
}

function WarningView(leftSideModel, rightSideModel) {
    this.leftSide = leftSideModel;
    this.rightSide = rightSideModel;
    this.elem = document.getElementById('warning');
}
WarningView.prototype.update = function() {
    // If both left and right side need warnings, only
    // display it for the leftSide. Otherwise, display nothing.
    var s = '';
    if(warnings[this.leftSide.getContext()]) {
        s = warnings[this.leftSide.getContext()];
    }
    else if (warnings[this.rightSide.getContext()]) {
        s = warnings[this.rightSide.getContext()];
    }
    this.elem.innerHTML = s;
}

function Swap24View(model) {
    this.model = model;
    this.td12  = document.getElementById('12');
    this.td24  = document.getElementById('24');
}
Swap24View.prototype.update = function() {
    var color = '#72B6EC';
    if(this.model.getIs24()) {
        this.td12.style.backgroundColor = null;
        this.td12.getElementsByTagName('a')[0].style.color = color;
        this.td24.style.backgroundColor = color;
        this.td24.getElementsByTagName('a')[0].style.color = 'white';
    } else {
        this.td12.style.backgroundColor = color;
        this.td12.getElementsByTagName('a')[0].style.color = 'white';
        this.td24.style.backgroundColor = null;
        this.td24.getElementsByTagName('a')[0].style.color = color;
    }
}

// TTZC is our controller class. This is its constructor.
function TTZC() {
    // create models, views, and wire everything up
    this.leftSide  = new SideModel();
    this.rightSide = new SideModel();
    this.swap24    = new Swap24Model();
    this.leftSideView  = new SideView(this.leftSide, 1);
    this.rightSideView = new SideView(this.rightSide, 2);
    this.warningView   = new WarningView(this.leftSide, this.rightSide);
    this.swap24View    = new Swap24View(this.swap24);
    this.leftSide.setViews(this.leftSideView, this.warningView);
    this.rightSide.setViews(this.rightSideView, this.warningView);
    this.swap24.setView(this.swap24View);

    this.siteInit();
}

document.write('<script type="text/javascript" src="http://www.thetimezoneconverter.com/datejs/build/date.js"></script>');
document.write('<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js"></script>');
document.write('<script type="text/javascript" src="js/jquery.autocomplete.js"></script>');

//document.write('<script type="text/javascript" src="datejs/build/date.js"></script>');
//document.write('<script type="text/javascript" src="js/jquery.js"></script>');
//document.write('<script type="text/javascript" src="js/jquery.autocomplete.js"></script>');

TTZC.prototype.siteInit = function() {
  initTzArrays();
  this.initContextUI();
  this.initLocalTimeFormat();
  
  this.setFieldDefaults();
  this.setAutofocus(getParam('tz'));
}

function autofocusElem(elem_id) {
  gid(elem_id).focus();
  gid(elem_id).select();
}

TTZC.prototype.initLocalTimeFormat = function() {
    var cookie_24h_time_format = cookie.time_format;
    if(cookie_24h_time_format) {
        time_format = (cookie_24h_time_format == '24h') ? TIME_FORMAT_24H : TIME_FORMAT_12H;
    } else {
        // look at browser's accept_language and attempt to format times correctly
        var langs = parseAcceptLanguage('en-US,en;q=0.8');
        // langs = ['az-cyrl-az'];
        for(var i=0; i < langs.length; i++) {
            if(shortTimes[langs[i]]) {
                time_format = shortTimes[langs[i]];
                break;
            }
        }
    }
  
    // set the ui widget
    // NOTE: This is a little 'double-work' because we re-save the cookie
    // right away upon reinitialization. Clean-up later.
    if(time_format.contains('H'))
        this.swap24.setTo24();
    else
        this.swap24.setTo12();
}

TTZC.prototype.setFieldDefaults = function() {
  var time = getParam('t');
  var context = getParam('tz');
  var current_time = Date.parse('Tuesday, 05-Jan-2016 11:55:18 GMT') || new Date();
  var t_parsed = validTimeParse(time);
  var t_formatted = t_parsed ? t_parsed.toString(time_format) : null;

  // different behavior if user specified a parameter for default context
  if(context) {
    var fixedtime;
    // if time was specified, 
    if(time) {
      this.leftSide.setTime(t_formatted);
      fixedtime = 'time1';
      
      this.leftSideView.disableTime();
      this.rightSideView.disableTime();
      this.leftSideView.disableContext();
    } else {
      this.rightSide.setTime(current_time.toString(time_format));
      fixedtime = 'time2';
    }
    
    this.leftSide.setContext(context);
    this.rightSide.setContext(LOCAL_TIME_STRING);
    this.convert2(fixedtime);
  } else {
    // set defaults - set the left fields
    if(time)
      this.leftSide.setTime(t_formatted);
    else
      this.leftSide.setTime(current_time.toString(time_format));
    this.leftSide.setContext(LOCAL_TIME_STRING);
    if(cookie.c2) {
      this.rightSide.setContext(cookie.c2)
      this.convert2('time1');
    }
  }

  var that = this;
  LOCAL_TIME_UPDATE_TIMEOUT_ID = setTimeout(function() {that.updateLocaltime();}, millisecondsToNextMinute());
}

function millisecondsToNextMinute() {
  var t = new Date();
  t.setMinutes(t.getMinutes() + 1);
  t.setSeconds(0);
  return t - (new Date());
}

TTZC.prototype.updateLocaltime = function() {
  if(this.leftSide.isLocal() && !local_dirty) {
    var current_time = new Date();
    this.leftSide.setTime(current_time.toString(time_format));
    this.convert2('time1');
    
    var that = this;
    LOCAL_TIME_UPDATE_TIMEOUT_ID = setTimeout(function() {that.updateLocaltime();}, 1000 * 60);
  } else {
    clearTimeout(LOCAL_TIME_UPDATE_TIMEOUT_ID);
  }
}

TTZC.prototype.setAutofocus = function(default_context) {
  if(!getParam('t') && default_context) {
    autofocusElem('time1');
  } else {
    autofocusElem('c2');
  }
}

function convertBase(s, from_tz_value, to_tz_value) {
  var utcDate = toUTC(validTimeParse(s), convert_map[from_tz_value]);
  var toDate = fromUTC(utcDate, convert_map[to_tz_value]);
  return toDate;
}

TTZC.prototype.convert2 = function(from) {
    this.convert(gid(from).value, from);
}
TTZC.prototype.convert  = function(s, from) {
  var fromSide, toSide;
  if(from == 'time1') {
      fromSide = this.leftSide;
      toSide = this.rightSide;
  }
  else if(from == 'time2') {
      fromSide = this.rightSide;
      toSide = this.leftSide;
  }

  var convertedDateString = '';
  var fromDate = validTimeParse(s);
  if((fromDate != null) && (fromSide.getOffset() != null) && (toSide.getOffset() != null)) {
    var toDate = convertBase(s, fromSide.getContext(), toSide.getContext());

    // New date objects cloned from each date
    var fromDay = new Date(fromDate.getTime());
    var toDay = new Date(toDate.getTime());
    // Measure days from the same hour
    fromDay.setHours(0);
    toDay.setHours(0);
    // Get difference between days
    var dDay = Math.round((toDay.getTime()-fromDay.getTime())/86400000);
    var dName = ['two days behind','previous day','','next day','two days ahead'];
    fromSide.getView().clearTimeInfo();
    // Add appropriate suffix if needed
    if (dDay != 0 && dDay > -3 && dDay < 3){
      toSide.getView().setTimeInfo(dName[dDay+2]);
    }

    convertedDateString = toDate.toString(time_format);
    toSide.setTime(convertedDateString);
    fromSide.getView().clearDirty();
  }
  else {
      toSide.getView().clearTimeInfo();
      fromSide.getView().clearTimeInfo();
  }
}

TTZC.recordQuery = function(cid, type) {
  var params = {};
  var cid_value = gid(cid).value;
  if(cid == 'c1')         params = {c1:cid_value, type:type};
  else                    params = {c2:cid_value, type:type};
  recordAction(params);
}

function recordAction(params) {
  if(window.location.host)
    $.ajax({async:true, url:'http://'+window.location.host+'/blank', data:params, dataType:'text'})
}

// context is string representing context (location, timezone name, etc.)
TTZC.prototype.contextChange = function(context, cid) {
  var thisSide;
  if(cid == 'c1') {
      thisSide = this.leftSide;
  }
  else if(cid == 'c2') {
      thisSide = this.rightSide;
  }
  thisSide.setContext(context);

  if(cid == 'c2') {
    cookie.c2 = context;
    cookie.store();
  }

  var other_id = (cid == 'c1') ? 'time2' : 'time1';
  var this_id = (cid == 'c1') ? 'time1' : 'time2';

  if(thisSide.getView().getDirty())
      this.convert2(this_id);
  else
      this.convert2(other_id);
}

TTZC.prototype.onTimeKeyUp = function(event) {
  var e = event || window.event;
  var code = e.charCode || e.keyCode;
  var t = e.target;
  if(!t) t = e.srcElement;
  if(code >= 32) { // ASCII control characters
    if(t.id == 'time1')
        this.leftSideView.setDirty();
    else if(t.id == 'time2')
        this.rightSideView.setDirty();
    local_dirty = true;
  }
  this.convert2(t.id);
}

TTZC.prototype.onContextMouseUp = function(target) {
  target.select();
}

TTZC.markError = function(target) {
  gid(target).style.color = '#922928';
}

TTZC.clearError = function(target) {
  gid(target).style.color = 'none';
}

TTZC.prototype.swap24h = function(elem) {
    this.swap24.toggleFormat();
    
    if(this.swap24.getIs24())
        time_format = TIME_FORMAT_24H;
    else
        time_format = TIME_FORMAT_12H;
  
  this.leftSideView.setTimeFormat(time_format);
  this.rightSideView.setTimeFormat(time_format);
}

function initTzArrays() {
  var local_offset_seconds = -(new Date()).getTimezoneOffset() * 60;
  convert_map[LOCAL_TIME_STRING] = local_offset_seconds;
  for(var s in gmts)    { convert_map[s] = gmts[s]; }
  for(var s in tznames) { convert_map[s] = tznames[s]; }
  for(var s in cities)  { convert_map[s] = cities[s]; }
}

TTZC.prototype.initContextUI = function() {
  var autocomplete_arr = [];
  for(var s in convert_map)  { autocomplete_arr.push(s); }
  autocomplete_arr.sort();

  var that = this;
  var options = { 
    lookup: autocomplete_arr,
    alwaysSelected: true,
    /* width:300, */
    onSelect: function(value, data) { that.contextChange(value,'c1'); }
  };
  $('#c1').autocomplete(options);
  options.onSelect = function(value, data) { that.contextChange(value,'c2'); }
  $('#c2').autocomplete(options);
}

function getParam(name) {
  var params = window.location.search;
  var match = params.match(RegExp(name + '=([^&]*)'));
  if(match && match.length >= 2) return decodeURIComponent(match[1]);
  return null;
}

// Utility functions
function toUTC(date, tz_offset_seconds) {
  return new Date(date.getTime() - tz_offset_seconds * 1000);
}
function fromUTC(date, tz_offset_seconds) {
  return new Date(date.getTime() + tz_offset_seconds * 1000);
}
function isDef(v) {
  return v != undefined;
}

function Cookie(name) {
  this.$name = name;
  var allcookies = document.cookie;
  if (allcookies == "") return;
  var cookies = allcookies.replace(/ /g, "").split(';');
  var cookie = null;
  for(var i = 0; i < cookies.length; i++) {
      if (cookies[i].substring(0, name.length+1) == (name + "=")) {
          cookie = cookies[i];
          break;
      }
  }

  if (cookie == null) return;
  var cookieval = cookie.substring(name.length+1);

  var a = cookieval.split('&'); // Break it into an array of name/value pairs
  for(var i=0; i < a.length; i++)  // Break each pair into an array
      a[i] = a[i].split(':');

  for(var i = 0; i < a.length; i++) {
      this[a[i][0]] = decodeURIComponent(a[i][1]);
  }
}

Cookie.prototype.store = function() {
  var cookieval = "";
  var daysToLive = 365;
  for(var prop in this) {
      // Ignore properties with names that begin with '$' and also methods
      if ((prop.charAt(0) == '$') || ((typeof this[prop]) == 'function'))
          continue;
      if (cookieval != "") cookieval += '&';
      cookieval += prop + ':' + encodeURIComponent(this[prop]);
  }
  var cookie = this.$name + '=' + cookieval + ";" + COOKIE_META;
  document.cookie = cookie;
}

function validTimeParse(s) {
  if(s == null) return null;
  if(isNaN(Number(s.charAt(0)))) return null;

  // try inserting : at position 1 or 2
  var s1=null,s2=null,r0=null,r1=null,r2=null;
  r0 = Date.parse(s);
  if(s.length >= 3) {
    s1 = s.substr(0,1) + ':' + s.substr(1,s.length);
    s2 = s.substr(0,2) + ':' + s.substr(2,s.length);
    r1 = Date.parse(s1);
    r2 = Date.parse(s2);
  }

  if((s.icontains('A') ||s.icontains('P')) && s.icontains(':')) {
    return r0;
  } else if((s.icontains('A') ||s.icontains('P')) && !s.icontains(':')) {
    return r0 ? r0 : r1 ? r1 : r2;
  } else if(!s.icontains(':') && s.length >= 3) {
    return r1 ? r1 : r2 ? r2 : r0;
  } else {
    // otherwise try appending ":00" to force time conversion
    return Date.parse(s + ":00");
  }
}

String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ''); }
String.prototype.contains = function(char) { return this.indexOf(char) != -1; }
String.prototype.icontains = function(char) { return this.toUpperCase().indexOf(char.toUpperCase()) != -1; }
function parseAcceptLanguage(s) {
  if(s[0] == '<') return ['en-us']; // the SSI was not replaced
  //s = 'da-DK,en-us;q=0.5'; // s = 'en-US,en;q=0.8'; // s = 'en-us';
  var elems = s.split(',');
  var langRanges = [];
  for(var i=0; i < elems.length; i++) {
    var elem = elems[i].trim();
    var langRange = elem.split(';')[0];
    langRanges.push(langRange.toLowerCase());
  }
  return langRanges;
}

function gid(id) {
  return document.getElementById(id);
}
