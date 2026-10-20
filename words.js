// Modern Greek sample words for each card: [word, simple respelling (stressed syllable in capitals), meaning].
// Capital cards use words that start with the capital; small cards show the letter in lowercase inside a word.
// In each word, the first occurrence of the card's letter is the one highlighted, so words are chosen where
// that occurrence is not part of a two-letter sound (αι, ει, οι, ου, αυ, ευ, γγ, γκ, μπ, ντ).
window.GREEK_WORDS = {
  'alpha.upper': [
    ['Αθήνα', 'a · THEE · na', 'Athens'],
    ['Αγάπη', 'a · GHA · pee', 'love'],
    ['Αέρας', 'a · E · ras', 'air, wind'],
    ['Άνθρωπος', 'AN · thro · pos', 'person'],
    ['Άμμος', 'A · mos', 'sand'],
    ['Αλάτι', 'a · LA · tee', 'salt']
  ],
  'alpha.lower': [
    ['αγόρι', 'a · GHO · ree', 'boy'],
    ['αστέρι', 'a · STE · ree', 'star'],
    ['καφές', 'ka · FES', 'coffee'],
    ['σαλάτα', 'sa · LA · ta', 'salad'],
    ['άλογο', 'A · lo · gho', 'horse'],
    ['μαμά', 'ma · MA', 'mum']
  ],
  'beta.upper': [
    ['Βιβλίο', 'vee · VLEE · o', 'book'],
    ['Βουνό', 'voo · NO', 'mountain'],
    ['Βροχή', 'vro · HEE', 'rain'],
    ['Βάρκα', 'VAR · ka', 'rowing boat'],
    ['Βράδυ', 'VRA · dhee', 'evening'],
    ['Βόλος', 'VO · los', 'Volos, a port city']
  ],
  'beta.lower': [
    ['βούτυρο', 'VOO · tee · ro', 'butter'],
    ['βότανο', 'VO · ta · no', 'herb'],
    ['καράβι', 'ka · RA · vee', 'ship'],
    ['αβγό', 'av · GHO', 'egg'],
    ['βήμα', 'VEE · ma', 'step'],
    ['βαλίτσα', 'va · LEE · tsa', 'suitcase']
  ],
  'gamma.upper': [
    ['Γάτα', 'GHA · ta', 'cat'],
    ['Γάλα', 'GHA · la', 'milk'],
    ['Γέφυρα', 'YE · fee · ra', 'bridge'],
    ['Γιαγιά', 'ya · YA', 'grandmother'],
    ['Γλυκό', 'ghlee · KO', 'sweet, dessert'],
    ['Γη', 'yee', 'earth']
  ],
  'gamma.lower': [
    ['γιατρός', 'ya · TROS', 'doctor'],
    ['αγορά', 'a · gho · RA', 'market'],
    ['γράμμα', 'GHRA · ma', 'letter'],
    ['γέλιο', 'YE · lee · o', 'laughter'],
    ['μαγαζί', 'ma · gha · ZEE', 'shop'],
    ['γλώσσα', 'GHLO · sa', 'language, tongue']
  ],
  'delta.upper': [
    ['Δέντρο', 'DHEN · dro', 'tree'],
    ['Δρόμος', 'DHRO · mos', 'road, street'],
    ['Δελφίνι', 'dhel · FEE · nee', 'dolphin'],
    ['Δώρο', 'DHO · ro', 'gift'],
    ['Δευτέρα', 'dhef · TE · ra', 'Monday'],
    ['Δελφοί', 'dhel · FEE', 'Delphi']
  ],
  'delta.lower': [
    ['δάσκαλος', 'DHA · ska · los', 'teacher'],
    ['δουλειά', 'dhoo · LYA', 'work'],
    ['παιδί', 'pe · DHEE', 'child'],
    ['δέκα', 'DHE · ka', 'ten'],
    ['ιδέα', 'ee · DHE · a', 'idea'],
    ['δωμάτιο', 'dho · MA · tee · o', 'room']
  ],
  'epsilon.upper': [
    ['Ελλάδα', 'e · LA · dha', 'Greece'],
    ['Ελιά', 'e · LYA', 'olive, olive tree'],
    ['Εβδομάδα', 'ev · dho · MA · dha', 'week'],
    ['Εδώ', 'e · DHO', 'here'],
    ['Έλα', 'E · la', 'come!'],
    ['Εκκλησία', 'e · klee · SEE · a', 'church']
  ],
  'epsilon.lower': [
    ['ελπίδα', 'el · PEE · dha', 'hope'],
    ['μέρα', 'ME · ra', 'day'],
    ['νερό', 'ne · RO', 'water'],
    ['φεγγάρι', 'fe · GA · ree', 'moon'],
    ['μέλι', 'ME · lee', 'honey'],
    ['τέχνη', 'TEKH · nee', 'art']
  ],
  'zeta.upper': [
    ['Ζωή', 'zo · EE', 'life'],
    ['Ζάχαρη', 'ZA · ha · ree', 'sugar'],
    ['Ζέστη', 'ZE · stee', 'heat'],
    ['Ζώο', 'ZO · o', 'animal'],
    ['Ζάκυνθος', 'ZA · keen · thos', 'Zakynthos, an island'],
    ['Ζυγαριά', 'zee · gha · RYA', 'scales']
  ],
  'zeta.lower': [
    ['ζωγράφος', 'zo · GHRA · fos', 'painter'],
    ['τραπέζι', 'tra · PE · zee', 'table'],
    ['κουζίνα', 'koo · ZEE · na', 'kitchen'],
    ['μαζί', 'ma · ZEE', 'together'],
    ['ζεστός', 'ze · STOS', 'warm'],
    ['ζάρι', 'ZA · ree', 'dice']
  ],
  'eta.upper': [
    ['Ήλιος', 'EE · lee · os', 'sun'],
    ['Ηλικία', 'ee · lee · KEE · a', 'age'],
    ['Ησυχία', 'ee · see · HEE · a', 'quiet'],
    ['Ήρωας', 'EE · ro · as', 'hero'],
    ['Ηράκλειο', 'ee · RA · klee · o', 'Heraklion, capital of Crete'],
    ['Ημέρα', 'ee · ME · ra', 'day (formal)']
  ],
  'eta.lower': [
    ['ζάχαρη', 'ZA · ha · ree', 'sugar'],
    ['νησί', 'nee · SEE', 'island'],
    ['μήλο', 'MEE · lo', 'apple'],
    ['ψυχή', 'psee · HEE', 'soul'],
    ['κήπος', 'KEE · pos', 'garden'],
    ['φίλη', 'FEE · lee', 'friend (female)']
  ],
  'theta.upper': [
    ['Θάλασσα', 'THA · la · sa', 'sea'],
    ['Θεός', 'the · OS', 'god'],
    ['Θέατρο', 'THE · a · tro', 'theatre'],
    ['Θεσσαλονίκη', 'the · sa · lo · NEE · kee', 'Thessaloniki'],
    ['Θησαυρός', 'thee · sav · ROS', 'treasure'],
    ['Θυμός', 'thee · MOS', 'anger']
  ],
  'theta.lower': [
    ['θέα', 'THE · a', 'view'],
    ['αθλητής', 'a · thlee · TEES', 'athlete'],
    ['μάθημα', 'MA · thee · ma', 'lesson'],
    ['καθρέφτης', 'ka · THREF · tees', 'mirror'],
    ['άνθος', 'AN · thos', 'blossom'],
    ['θερμός', 'ther · MOS', 'hot']
  ],
  'iota.upper': [
    ['Ιστορία', 'ee · sto · REE · a', 'history, story'],
    ['Ιούλιος', 'ee · OO · lee · os', 'July'],
    ['Ιδέα', 'ee · DHE · a', 'idea'],
    ['Ιθάκη', 'ee · THA · kee', 'Ithaca'],
    ['Ίσως', 'EE · sos', 'maybe'],
    ['Ιππότης', 'ee · PO · tees', 'knight']
  ],
  'iota.lower': [
    ['σπίτι', 'SPEE · tee', 'house'],
    ['φίλος', 'FEE · los', 'friend'],
    ['κρασί', 'kra · SEE', 'wine'],
    ['ψάρι', 'PSA · ree', 'fish'],
    ['μολύβι', 'mo · LEE · vee', 'pencil'],
    ['τυρί', 'tee · REE', 'cheese']
  ],
  'kappa.upper': [
    ['Καλημέρα', 'ka · lee · ME · ra', 'good morning'],
    ['Καφές', 'ka · FES', 'coffee'],
    ['Καρδιά', 'kar · DHYA', 'heart'],
    ['Κρήτη', 'KREE · tee', 'Crete'],
    ['Κόσμος', 'KO · zmos', 'world, people'],
    ['Κλειδί', 'klee · DHEE', 'key']
  ],
  'kappa.lower': [
    ['κήπος', 'KEE · pos', 'garden'],
    ['φάκελος', 'FA · ke · los', 'envelope'],
    ['νίκη', 'NEE · kee', 'victory'],
    ['κερί', 'ke · REE', 'candle'],
    ['κόκκινος', 'KO · kee · nos', 'red'],
    ['βιβλιοθήκη', 'vee · vlee · o · THEE · kee', 'library']
  ],
  'lambda.upper': [
    ['Λεμόνι', 'le · MO · nee', 'lemon'],
    ['Λουλούδι', 'loo · LOO · dhee', 'flower'],
    ['Λόγος', 'LO · ghos', 'word, reason'],
    ['Λίμνη', 'LEEM · nee', 'lake'],
    ['Λευκός', 'lef · KOS', 'white'],
    ['Λιμάνι', 'lee · MA · nee', 'harbour']
  ],
  'lambda.lower': [
    ['ήλιος', 'EE · lee · os', 'sun'],
    ['γάλα', 'GHA · la', 'milk'],
    ['καλός', 'ka · LOS', 'good'],
    ['λάδι', 'LA · dhee', 'olive oil'],
    ['σελίδα', 'se · LEE · dha', 'page'],
    ['μήλο', 'MEE · lo', 'apple']
  ],
  'mu.upper': [
    ['Μητέρα', 'mee · TE · ra', 'mother'],
    ['Μουσική', 'moo · see · KEE', 'music'],
    ['Μέλι', 'ME · lee', 'honey'],
    ['Μάτι', 'MA · tee', 'eye'],
    ['Μύκονος', 'MEE · ko · nos', 'Mykonos'],
    ['Μήνας', 'MEE · nas', 'month']
  ],
  'mu.lower': [
    ['μαχαίρι', 'ma · HE · ree', 'knife'],
    ['όνομα', 'O · no · ma', 'name'],
    ['σήμερα', 'SEE · me · ra', 'today'],
    ['ψωμί', 'pso · MEE', 'bread'],
    ['νούμερο', 'NOO · me · ro', 'number'],
    ['μύτη', 'MEE · tee', 'nose']
  ],
  'nu.upper': [
    ['Νερό', 'ne · RO', 'water'],
    ['Νύχτα', 'NEEKH · ta', 'night'],
    ['Νησί', 'nee · SEE', 'island'],
    ['Νάξος', 'NA · ksos', 'Naxos'],
    ['Νέος', 'NE · os', 'new, young'],
    ['Νίκη', 'NEE · kee', 'victory']
  ],
  'nu.lower': [
    ['ουρανός', 'oo · ra · NOS', 'sky'],
    ['σύννεφο', 'SEE · ne · fo', 'cloud'],
    ['νοσοκομείο', 'no · so · ko · MEE · o', 'hospital'],
    ['τηλέφωνο', 'tee · LE · fo · no', 'telephone'],
    ['βουνό', 'voo · NO', 'mountain'],
    ['χιόνι', 'HYO · nee', 'snow']
  ],
  'xi.upper': [
    ['Ξύλο', 'KSEE · lo', 'wood'],
    ['Ξενοδοχείο', 'kse · no · dho · HEE · o', 'hotel'],
    ['Ξένος', 'KSE · nos', 'stranger, foreigner'],
    ['Ξανά', 'ksa · NA', 'again'],
    ['Ξυπνητήρι', 'ksee · pnee · TEE · ree', 'alarm clock']
  ],
  'xi.lower': [
    ['ταξίδι', 'ta · KSEE · dhee', 'journey'],
    ['έξι', 'E · ksee', 'six'],
    ['ξύδι', 'KSEE · dhee', 'vinegar'],
    ['αλεξίπτωτο', 'a · le · KSEEP · to · to', 'parachute'],
    ['δεξιά', 'dhe · KSYA', 'right (direction)'],
    ['τάξη', 'TA · ksee', 'class, order']
  ],
  'omicron.upper': [
    ['Όνειρο', 'O · nee · ro', 'dream'],
    ['Όνομα', 'O · no · ma', 'name'],
    ['Ομπρέλα', 'om · BRE · la', 'umbrella'],
    ['Οδός', 'o · DHOS', 'street (on signs)'],
    ['Όχι', 'O · hee', 'no'],
    ['Ολυμπία', 'o · leem · BEE · a', 'Olympia'],
    ['Οκτώ', 'ok · TO', 'eight']
  ],
  'omicron.lower': [
    ['σκύλος', 'SKEE · los', 'dog'],
    ['πόλη', 'PO · lee', 'city'],
    ['νερό', 'ne · RO', 'water'],
    ['δρόμος', 'DHRO · mos', 'road'],
    ['ποτήρι', 'po · TEE · ree', 'glass'],
    ['σχολείο', 'skho · LEE · o', 'school']
  ],
  'pi.upper': [
    ['Πόλη', 'PO · lee', 'city'],
    ['Πατέρας', 'pa · TE · ras', 'father'],
    ['Πόρτα', 'POR · ta', 'door'],
    ['Πάτρα', 'PA · tra', 'Patras'],
    ['Πρωί', 'pro · EE', 'morning'],
    ['Παράθυρο', 'pa · RA · thee · ro', 'window']
  ],
  'pi.lower': [
    ['σπίτι', 'SPEE · tee', 'house'],
    ['πουλί', 'poo · LEE', 'bird'],
    ['καπέλο', 'ka · PE · lo', 'hat'],
    ['πιάτο', 'PYA · to', 'plate'],
    ['ύπνος', 'EE · pnos', 'sleep'],
    ['πράσινος', 'PRA · see · nos', 'green']
  ],
  'rho.upper': [
    ['Ρόδος', 'RO · dhos', 'Rhodes'],
    ['Ρολόι', 'ro · LO · ee', 'clock, watch'],
    ['Ρύζι', 'REE · zee', 'rice'],
    ['Ρούχα', 'ROO · ha', 'clothes'],
    ['Ροδάκινο', 'ro · DHA · kee · no', 'peach'],
    ['Ρήμα', 'REE · ma', 'verb']
  ],
  'rho.lower': [
    ['ρόδι', 'RO · dhee', 'pomegranate'],
    ['μέρα', 'ME · ra', 'day'],
    ['χαρά', 'ha · RA', 'joy'],
    ['φούρνος', 'FOOR · nos', 'oven, bakery'],
    ['αέρας', 'a · E · ras', 'air, wind'],
    ['κορίτσι', 'ko · REE · tsee', 'girl']
  ],
  'sigma.upper': [
    ['Σπίτι', 'SPEE · tee', 'house'],
    ['Σαντορίνη', 'san · do · REE · nee', 'Santorini'],
    ['Σήμερα', 'SEE · me · ra', 'today'],
    ['Σχολείο', 'skho · LEE · o', 'school'],
    ['Σκύλος', 'SKEE · los', 'dog'],
    ['Σούπα', 'SOO · pa', 'soup']
  ],
  'sigma.lower': [
    ['θάλασσα', 'THA · la · sa', 'sea'],
    ['σαλάτα', 'sa · LA · ta', 'salad'],
    ['σύννεφο', 'SEE · ne · fo', 'cloud'],
    ['νησί', 'nee · SEE', 'island'],
    ['σοκολάτα', 'so · ko · LA · ta', 'chocolate'],
    ['φασόλι', 'fa · SO · lee', 'bean']
  ],
  'tau.upper': [
    ['Τραπέζι', 'tra · PE · zee', 'table'],
    ['Τυρί', 'tee · REE', 'cheese'],
    ['Τρένο', 'TRE · no', 'train'],
    ['Τετάρτη', 'te · TAR · tee', 'Wednesday'],
    ['Τήνος', 'TEE · nos', 'Tinos, an island'],
    ['Τσάι', 'TSA · ee', 'tea']
  ],
  'tau.lower': [
    ['μάτι', 'MA · tee', 'eye'],
    ['αυτοκίνητο', 'af · to · KEE · nee · to', 'car'],
    ['στόμα', 'STO · ma', 'mouth'],
    ['πορτοκάλι', 'por · to · KA · lee', 'orange'],
    ['κουτί', 'koo · TEE', 'box'],
    ['τώρα', 'TO · ra', 'now']
  ],
  'upsilon.upper': [
    ['Ύπνος', 'EE · pnos', 'sleep'],
    ['Υγεία', 'ee · YEE · a', 'health'],
    ['Ύδρα', 'EE · dhra', 'Hydra, an island'],
    ['Υπολογιστής', 'ee · po · lo · yee · STEES', 'computer'],
    ['Ύψος', 'EE · psos', 'height'],
    ['Υπέροχος', 'ee · PE · ro · hos', 'wonderful']
  ],
  'upsilon.lower': [
    ['μύτη', 'MEE · tee', 'nose'],
    ['νύχτα', 'NEEKH · ta', 'night'],
    ['σύννεφο', 'SEE · ne · fo', 'cloud'],
    ['κύμα', 'KEE · ma', 'wave'],
    ['ψυχή', 'psee · HEE', 'soul'],
    ['ζυμάρι', 'zee · MA · ree', 'dough']
  ],
  'phi.upper': [
    ['Φίλος', 'FEE · los', 'friend'],
    ['Φως', 'fos', 'light'],
    ['Φεγγάρι', 'fe · GA · ree', 'moon'],
    ['Φαγητό', 'fa · yee · TO', 'food'],
    ['Φούρνος', 'FOOR · nos', 'oven, bakery'],
    ['Φθινόπωρο', 'fthee · NO · po · ro', 'autumn']
  ],
  'phi.lower': [
    ['καφές', 'ka · FES', 'coffee'],
    ['αδελφός', 'a · dhel · FOS', 'brother'],
    ['φωτιά', 'fo · TYA', 'fire'],
    ['ελέφαντας', 'e · LE · fan · das', 'elephant'],
    ['φύλλο', 'FEE · lo', 'leaf'],
    ['τηλέφωνο', 'tee · LE · fo · no', 'telephone']
  ],
  'chi.upper': [
    ['Χαρά', 'ha · RA', 'joy'],
    ['Χέρι', 'HE · ree', 'hand'],
    ['Χειμώνας', 'hee · MO · nas', 'winter'],
    ['Χρόνος', 'HRO · nos', 'time, year'],
    ['Χανιά', 'ha · NYA', 'Chania, a city in Crete'],
    ['Χρυσός', 'hree · SOS', 'gold']
  ],
  'chi.lower': [
    ['όχι', 'O · hee', 'no'],
    ['νύχτα', 'NEEKH · ta', 'night'],
    ['χιόνι', 'HYO · nee', 'snow'],
    ['βροχή', 'vro · HEE', 'rain'],
    ['ψυχή', 'psee · HEE', 'soul'],
    ['μαχαίρι', 'ma · HE · ree', 'knife']
  ],
  'psi.upper': [
    ['Ψάρι', 'PSA · ree', 'fish'],
    ['Ψωμί', 'pso · MEE', 'bread'],
    ['Ψυχή', 'psee · HEE', 'soul'],
    ['Ψηλός', 'psee · LOS', 'tall'],
    ['Ψέμα', 'PSE · ma', 'lie'],
    ['Ψαράς', 'psa · RAS', 'fisherman']
  ],
  'psi.lower': [
    ['ύψος', 'EE · psos', 'height'],
    ['ψιχάλα', 'psee · HA · la', 'drizzle'],
    ['ψυγείο', 'psee · YEE · o', 'fridge'],
    ['ταψί', 'ta · PSEE', 'baking tray'],
    ['ψάρι', 'PSA · ree', 'fish'],
    ['ψηλός', 'psee · LOS', 'tall']
  ],
  'omega.upper': [
    ['Ώρα', 'O · ra', 'hour, time'],
    ['Ωκεανός', 'o · ke · a · NOS', 'ocean'],
    ['Ωραίος', 'o · RE · os', 'beautiful'],
    ['Ωδή', 'o · DHEE', 'ode'],
    ['Ώμος', 'O · mos', 'shoulder']
  ],
  'omega.lower': [
    ['ψωμί', 'pso · MEE', 'bread'],
    ['φως', 'fos', 'light'],
    ['ζωή', 'zo · EE', 'life'],
    ['δώρο', 'DHO · ro', 'gift'],
    ['τώρα', 'TO · ra', 'now'],
    ['χώρα', 'HO · ra', 'country']
  ]
};
