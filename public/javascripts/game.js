async function checkwords(woord) {
    
    try {
        let response = await fetch('http://localhost:3000/api/Woordenlijst');

        if (!response.ok) throw new Error("Fout bij ophalen van gegevens");
        const data = await response.json();

        const bestaat = data.some(item => item.Woord.toLowerCase() === woord.toLowerCase());

        if (bestaat) {
            return('true');
        }
        else {
            return('false');
        }
    } catch (error) {
        console.error("Er ging iets mis", error.message);
    }
}

async function test() {  
    console.log(await checkwords('apple'));
    console.log(await checkwords('XAI'));
}

test();

async function checkwords1(woord) {
    
    try {
        let response = await fetch('http://localhost:3000/api/woordenNL');

        if (!response.ok) throw new Error("Fout bij ophalen van gegevens");
        const data = await response.json();

        const bestaat = data.some(item => 
            [
                item.basiswoorden_gekeurd,
                item.basiswoorden_ongekeurd,
                item.flexies_ongekeurd,
                item.romeinse_cijfers,
                item.ascii,
                item.non_ascii
            ].some(veld =>
                veld && veld.toLowerCase() === woord.toLowerCase()
            )
                
        );

        if (bestaat) {
            return('true');
        }
        else {
            return('false');
        }
    } catch (error) {
        console.error("Er ging iets mis", error.message);
    }
}

async function test1() {  
    console.log(await checkwords1('epple'));
    console.log(await checkwords1('telefoon'));
}

test1();