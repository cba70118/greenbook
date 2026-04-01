// Valero 2026 odds (b365 updated Apr 1)
(function() {
    if (!TOURNAMENT_DATA || !TOURNAMENT_DATA.valero) return;

    TOURNAMENT_DATA.valero.oddsBoard = [
        { rank:1, name:"Ludvig Aberg", best:"+1600 DK", t5:"+340", t20:"-120", b365:"+1400", b365_8:"+1200", b365_10:"+1100", form:"cool", note:"Co-favorite. Shortened from +1600. Meta #4. 6mo TOT#20, TPC SA comp #54." },
        { rank:2, name:"Tommy Fleetwood", best:"+1450 DK", t5:"+290", t20:"-144", b365:"+1400", b365_8:"+1200", b365_10:"+1100", form:"cool", note:"Co-favorite. DG #1 final prediction. But 2025 Valero SG:TOT #111 (+8)." },
        { rank:3, name:"Jordan Spieth", best:"+1950 DK", t5:"+385", t20:"-108", b365:"+1600", b365_8:"+1400", b365_10:"+1200", form:"TAILWIND", note:"Bet Boost +1800. DG TAILWIND 1.57. Course history +0.341. TPC SA king." },
        { rank:4, name:"Russell Henley", best:"+1850 DK", t5:"+360", t20:"-138", b365:"+1600", b365_8:"+1400", b365_10:"+1200", form:"neutral", note:"Bet Boost +1800. Unanimous expert #1. APP+ARG fit." },
        { rank:5, name:"Robert MacIntyre", best:"+1650 DK", t5:"+335", t20:"-124", b365:"+1800", b365_8:"+1600", b365_10:"+1400", form:"neutral", note:"DG #2 final prediction. Not in our composite top-10." },
        { rank:6, name:"Si Woo Kim", best:"+1900 DK", t5:"+365", t20:"-124", b365:"+2000", b365_8:"+1800", b365_10:"+1600", form:"warm", note:"RH #1. DG warm 1.07. APP #1 in 6mo. PUTT #111 risk." },
        { rank:7, name:"Hideki Matsuyama", best:"+2300 DK", t5:"+435", t20:"+100", b365:"+2200", b365_8:"+2000", b365_10:"+1800", form:"warm", note:"APP#8+ARG#2 dual fit. DG warm 1.14. 2025 PUTT#134 concern." },
        { rank:8, name:"Sepp Straka", best:"+3100 DK", t5:"+570", t20:"+134", b365:"+2200", b365_8:"+2000", b365_10:"+1800", form:"cool", note:"DG dropped to cool 0.81. 3 narrative sources. b365 shorter than DK." },
        { rank:9, name:"Maverick McNealy", best:"+2400 DK", t5:"+460", t20:"+108", b365:"+2500", b365_8:"+2200", b365_10:"+2000", form:"neutral", note:"ON CARD +2400 DK. Shortened from +2800. Positive CLV. Expert #7." },
        { rank:10, name:"Rickie Fowler", best:"+2700 DK", t5:"+500", t20:"+112", b365:"+2800", b365_8:"+2500", b365_10:"+2200", form:"neutral", note:"Rick likes (driving+putting). DG neutral 0.98." },
        { rank:11, name:"Keith Mitchell", best:"+3700 DK", t5:"+670", t20:"+152", b365:"+3000", b365_8:"+2800", b365_10:"+2500", form:"warm", note:"DG warm 1.07. Course history +0.150. Noonan #2." },
        { rank:12, name:"Michael Thorbjornsen", best:"+2500 DK", t5:"+475", t20:"+110", b365:"+3000", b365_8:"+2800", b365_10:"+2500", form:"HEADWIND", note:"Bet Boost +4000. DG HEADWIND 0.71." },
        { rank:13, name:"Alex Noren", best:"+3900 DK", t5:"+670", t20:"+146", b365:"+3300", b365_8:"+3000", b365_10:"+2800", form:"TAILWIND", note:"DG TAILWIND 1.24. Andy2 #4. Wind #6. Undervalued." },
        { rank:14, name:"Johnny Keefer", best:"+6800 DK", t5:"+1100", t20:"+520", b365:"+3500", b365_8:"+3300", b365_10:"+3000", form:"neutral", note:"Home course. b365 way shorter than DK." },
        { rank:15, name:"Ryo Hisatsune", best:"+4700 DK", t5:"+790", t20:"+176", b365:"+3500", b365_8:"+3300", b365_10:"+3000", form:"cool", note:"DG dropped to cool 0.81. APP+ARG dual fit. FRL ON CARD." },
        { rank:16, name:"Denny McCarthy", best:"+6100 DK", t5:"+1050", t20:"+215", b365:"+4000", b365_8:"+3500", b365_10:"+3300", form:"TAILWIND", note:"ON CARD +3000 b365. DG TAILWIND 1.83 (highest in field!). Course specialist." },
        { rank:17, name:"J.J. Spaun", best:"+3400 DK", t5:"+610", t20:"+132", b365:"+4500", b365_8:"+4000", b365_10:"+3500", form:"warm", note:"2022 champion. DG warm 1.16. Course history +0.178." },
        { rank:18, name:"Rico Hoey", best:"+7200 DK", t5:"+1150", t20:"+530", b365:"+5000", b365_8:"+4500", b365_10:"+4000", form:"HEADWIND", note:"2025 APP#2 at TPC SA. But PUTT -0.36 and DG HEADWIND." },
        { rank:19, name:"Sudarshan Yellamaraju", best:"+7400 DK", t5:"+1150", t20:"+250", b365:"+5000", b365_8:"+4500", b365_10:"+4000", form:"HEADWIND", note:"ON CARD +14000 DK. Drifted from +4500 to +5000. DG HEADWIND." },
        { rank:20, name:"Thorbjorn Olesen", best:"+6200 DK", t5:"+990", t20:"+455", b365:"+5000", b365_8:"+4500", b365_10:"+4000", form:"warm", note:"FRL ON CARD. 2025 SG:TOT#5. DG warm 1.05." },
        { rank:21, name:"Brian Harman", best:"+7400 DK", t5:"+1150", t20:"+230", b365:"+5500", b365_8:"+5000", b365_10:"+4500", form:"TAILWIND", note:"Defending champ. DG TAILWIND 1.60. Course history +0.259." },
        { rank:22, name:"Marco Penge", best:"+5300 DK", t5:"+930", t20:"+445", b365:"+5500", b365_8:"+5000", b365_10:"+4500", form:"HEADWIND", note:"OTT +0.90 bomber. DG HEADWIND." },
        { rank:23, name:"Christiaan Bezuidenhout", best:"+8200 DK", t5:"+1225", t20:"+540", b365:"+6000", b365_8:"+5500", b365_10:"+5000", form:"TAILWIND", note:"Shortened from +8000. DG TAILWIND 1.31. ARG#7+PUTT#7 in 6mo." },
        { rank:24, name:"Nick Taylor", best:"+5200 DK", t5:"+840", t20:"+385", b365:"+6000", b365_8:"+5500", b365_10:"+5000", form:"TAILWIND", note:"Shortened from +6600. DG TAILWIND 1.50. Course hist +0.155. Mayo main man." },
        { rank:25, name:"Alex Smalley", best:"+7000 DK", t5:"+1100", t20:"+500", b365:"+6600", b365_8:"+6000", b365_10:"+5500", form:"cool", note:"6mo TOT#23. Ball-striker. Putting #86 is the ceiling." },
        { rank:26, name:"Jordan Smith", best:"+5900 DK", t5:"+960", t20:"+200", b365:"+6600", b365_8:"+6000", b365_10:"+5500", form:"HEADWIND", note:"DG HEADWIND. Form crashed." },
        { rank:27, name:"Mac Meissner", best:"+7300 DK", t5:"+1425", t20:"+630", b365:"+7000", b365_8:"+6600", b365_10:"+5500", form:"neutral", note:"FRL ON CARD. Andy2 #6. Drifted from +6600." },
        { rank:28, name:"Max McGreevy", best:"+9400 DK", t5:"+1400", t20:"+600", b365:"+7000", b365_8:"+6600", b365_10:"+5500", form:"neutral", note:"6mo TOT#7. Quietly solid form." },
    ];
})();
