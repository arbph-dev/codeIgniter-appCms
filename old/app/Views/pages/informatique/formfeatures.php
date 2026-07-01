<div id="devone" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
            <!-- article Formulaires -->
        <header>
        <h1>Formulaires</h1>
        <p>elements de formulaires et mise en oeuvre</p>
        </header>
        
        <section>
            <h2>Controles</h2>
            <div>
            <div>
                <h3>form mot</h3>

                    <form id="motForm"  onsubmit="return validateForm(this)">
                        <label for="idInput">ID (optionnel) :</label><br />
                        <input type="number" id="idInput" name="motid" min="1" /><br />

                        <label for="qInput">Mot (optionnel) :</label><br />
                        <input type="text" id="qInput" name="motq" /><br />

                        <input type="submit" value="Submit">
                        <div id="result"></div>  
                    </form>

                                
                
            </div>
            <aside>
                Les controles elementaires font intervenir 2 à 3 elements
                la structure
                le style
                les scripts
            </aside>
            </div>
        </section>

    </article>     

</div>
