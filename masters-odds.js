// Masters 2026 odds (FD + DK, parsed Mar 28)
(function() {
    if (!TOURNAMENT_DATA || !TOURNAMENT_DATA.masters) return;

    TOURNAMENT_DATA.masters.oddsBoard = [
        { rank:1, name:"Scottie Scheffler", best:"+350 DK", b365:"+450", form:"warm", note:"2x champion. WD Houston (paternity). 1mo form dipping." },
        { rank:2, name:"Rory McIlroy", best:"+700 DK", b365:"+1000", form:"warm", note:"Defending champ. Career slam completed 2025. Form lukewarm since." },
        { rank:3, name:"Jon Rahm", best:"+1200", b365:"+1200", form:"warm", note:"2023 champion. LIV = no recent PGA data. 5-for-5 T10 at Augusta." },
        { rank:4, name:"Bryson DeChambeau", best:"+1000 DK", b365:"+1100", form:"neutral", note:"2-for-2 T10 at Augusta. LIV hype inflating price. Comp #33." },
        { rank:5, name:"Ludvig Aberg", best:"+1600", b365:"+1200", form:"warm", note:"T2 on Masters debut 2024. Elite talent. 1 Augusta start." },
        { rank:6, name:"Xander Schauffele", best:"+1600 FD", b365:"+1600", form:"caution", note:"2 major wins 2024. Returning from injury. T4 Valspar encouraging." },
        { rank:7, name:"Tommy Fleetwood", best:"+1800 DK", b365:"+2200", form:"warm", note:"3 Augusta T10s. 5yr-comp #7. Consistent but no major win." },
        { rank:8, name:"Collin Morikawa", best:"+2200 DK", b365:"+2500", form:"caution", note:"APP #1 on Tour. 3 Augusta T10s. Back injury — WD at Players." },
        { rank:9, name:"Cameron Young", best:"+2500 FD", b365:"+2500", form:"TAILWIND", note:"Won Players 2026. Hottest form on Tour. 2 Augusta starts (T7, T9)." },
        { rank:10, name:"Matt Fitzpatrick", best:"+2200 FD", b365:"+2500", form:"TAILWIND", note:"Won Valspar 2026. Iron precision elite. US Open champ." },
        { rank:11, name:"Hideki Matsuyama", best:"+3300 FD", b365:"+3300", form:"warm", note:"2021 champion. 4 Augusta T10s. APP + ARG elite for Augusta." },
        { rank:12, name:"Jordan Spieth", best:"+3300 FD", b365:"+4500", form:"cool", note:"6-for-6 Augusta T10s. Won 2015. Best active Augusta record. Form declining." },
        { rank:13, name:"Patrick Cantlay", best:"+5000 DK", b365:"+6600", form:"cool", note:"4 Augusta T10s. 5yr-comp #6. Market has drifted him out. Quiet consistency." },
        { rank:14, name:"Russell Henley", best:"+5500 FD", b365:"+5500", form:"warm", note:"Fits every Augusta fingerprint. Valero RH model #1. Chronically underpriced." },
        { rank:15, name:"Cameron Smith", best:"+6600 DK", b365:"+8000", form:"neutral", note:"4-for-4 Augusta T10s. Par 5 king. LIV discount creates longest price for his history." },
        { rank:16, name:"Shane Lowry", best:"+4500", b365:"+5000", form:"cool", note:"T3 Augusta 2024. APP +0.70 elite. Form has dipped." },
        { rank:17, name:"Adam Scott", best:"+6500 FD", b365:"+8000", form:"warm", note:"3-for-3 Augusta T10s. Won 2013. Ball speed +4mph in 2026. Age 45." },
        { rank:18, name:"Jason Day", best:"+6500 FD", b365:"+7000", form:"cool", note:"4-for-4 Augusta T10s. ARG +0.33 at hardest ARG course. T5 Houston." },
        { rank:19, name:"Justin Rose", best:"+2700 FD", b365:"+2800", form:"neutral", note:"5x R1 leader at Augusta (record). 4 T10s. Can't convert leads. Comp #46." },
        { rank:20, name:"Justin Thomas", best:"+4000 DK", b365:"+4500", form:"cool", note:"3 Augusta T10s. ARG +0.41 elite. 6mo comp-course #58. Declining form." },
        { rank:21, name:"Brooks Koepka", best:"+3000 FD", b365:"+4000", form:"neutral", note:"3 Augusta T10s (T2 twice). Major pedigree. Ball speed up 2mph." },
        { rank:22, name:"Patrick Reed", best:"+2700 FD", b365:"+3300", form:"neutral", note:"Won 2018. 4 Augusta T10s. LIV. ARG #5 at comp courses." },
        { rank:23, name:"Will Zalatoris", best:"+5500 DK", b365:"+10000", form:"caution", note:"3-for-3 Augusta T10s (2nd, T6, T9). Back from injury. APP elite for Augusta." },
        { rank:24, name:"Akshay Bhatia", best:"+5500", b365:"+5500", form:"caution", note:"AP Inv winner. 1mo form #3. In India pre-Masters. No Augusta pedigree." },
        { rank:25, name:"Si Woo Kim", best:"+5500 FD", b365:"+6600", form:"warm", note:"6mo form #3. Valero model #3. OWGR #29. No Augusta T10 history." },
    ];
})();
