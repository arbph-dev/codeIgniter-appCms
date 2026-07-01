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
                <h3>Les controles elementaires</h3>
                    <form id="form1" class="form_style1"  onsubmit="return validateForm(this)">
                    <label for="fname">First Name</label>
                    <input type="text" id="fname" name="firstname" value="" pattern="[a-zA-Z]{2,50}" placeholder="Saisir le prénom"/>

                    <label for="lname">Last Name</label>
                    <input type="text" id="lname" name="lastname" placeholder="Your last name..">

                    <label for="country">Country</label>
                    <select id="country" name="country">
                        <option value="australia">Australia</option>
                        <option value="canada">Canada</option>
                        <option value="usa">USA</option>
                    </select>
                    <textarea name="message">Some text...</textarea>
                    <input type="submit" value="Submit">
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

        <section>
            <h2>Controles 2</h2>
            <div>
            <div>
                <h3>Les controles elementaires</h3>
                    <form id="form2" class="form_style1"  onsubmit="return validateForm(this)">
                    <label for="fname">First Name</label>
                    <input type="text" name="firstname" value="" pattern="[a-zA-Z]{2,50}" placeholder="Saisir le prénom"/>

                    <label for="lname">Last Name</label>
                    <input type="text" name="lastname" placeholder="Your last name..">

                    <label for="country">Country</label>
                    <select name="country">
                        <option value="australia">Australia</option>
                        <option value="canada">Canada</option>
                        <option value="usa">USA</option>
                    </select>
                    <textarea name="message">Some text...</textarea>
                    <input type="submit" value="Submit">
                    </form>                    
                
            </div>
            <aside>
                ne pas affecter id pour pouvir remployer nom de champs ?<br/>
                <button onclick="showModal('DIALOG_1')">showModal DIALOG_1</button>
                <button onclick="showModal('DIALOG_2')">showModal DIALOG_2</button>
            </aside>
            </div>
        </section>

        <section>
            <h2>Controles 3</h2>
            <div>
            <div>
                <h3>Les controles elementaires</h3>
                    <form id="form3" class="form_style1"  onsubmit="return validateForm(this)">
                    <!--<label for="username">Username:</label> necessite id sur le champ-->
                    <label>Username:</label>
                    
                    <input type="text" name="username" value="" required placeholder="Saisir le prénom"/>
                    <!-- moche mais 
                        required affiche la bordure rouge ok??
                    <input type="text" name="username" value="" required minlength="3" maxlength="15" placeholder="Saisir le prénom"/>
                    -->
                    
                    
                    <label>Email:</label><input type="email" name="email" required/>
                    <label>Password:</label><input type="password" name="password" />
                    <label>Age:</label><input type="number" name="age" min="18" max="99"/>


                    <input type="submit" value="Submit">
                    <div class="form_error1">---</div>
                    </form>                  
                                        
            </div>
            <aside>
                ne pas affecter id pour pouvir remployer nom de champs ?<br/>
                <button onclick="showModal('DIALOG_1')">showModal DIALOG_1</button>
                <button onclick="showModal('DIALOG_2')">showModal DIALOG_2</button>
            </aside>
            </div>
        </section>


        <section>
            <h2>Controles 4</h2>
            <div>
            <div>
                <h3>Les controles elementaires</h3>
                    <form id="form4" class="form_style1"  onsubmit="return validateForm(this)">
                    <!--<label for="username">Username:</label> necessite id sur le champ-->
                    <label>Username:</label>
                    
                    <input type="text" name="username" value="" required placeholder="Saisir le prénom"/>

                    
                    <label>Email:</label><input type="email" name="email" required/>
                    <label>Password:</label><input type="password" name="password" />
                    <label>Age:</label><input type="number" name="age" min="18" max="99"/>

                    <div class="radio">

                        <label>Internet Explorer
                        <input type="radio" name="browser" onclick="checkRadio(this.value , 'browser' )" value="Internet Explorer">
                        </label>
                    
                        <label>Firefox
                        <input type="radio" name="browser" onclick="checkRadio(this.value , 'browser')" value="Firefox">
                        </label>
                        
                        <label>Google Chrome
                        <input type="radio" name="browser" onclick="checkRadio(this.value , 'browser')" value="Google Chrome" checked>
                        </label>
                        
                        <label>Opera
                        <input type="radio" name="browser" onclick="checkRadio(this.value , 'browser')" value="Opera">
                        </label>

                    </div>

                    <div class="radio">
                        <label>HTML<input type="radio" name="language" onclick="checkRadio(this.value , 'language' )" value="HTML"></label>
                        <label>Javascript<input type="radio" name="language" onclick="checkRadio(this.value , 'language')" value="JS"></label>
                        <label>CSS<input type="radio" name="language" onclick="checkRadio(this.value , 'language')" value="CSS" checked></label>
                        <label>PHP<input type="radio" name="language" onclick="checkRadio(this.value , 'language')" value="PHP"></label>
                    </div>

                    <input type="submit" value="Submit">
                    <div class="form_error1">---</div>
                    </form>                  
                                        
            </div>
            <aside>
                ne pas affecter id pour pouvir remployer nom de champs ?<br/>
                <button onclick="showModal('DIALOG_1')">showModal DIALOG_1</button>
                <button onclick="showModal('DIALOG_2')">showModal DIALOG_2</button>
            </aside>
            </div>
        </section>

        <section>
            <h2>Controles 5</h2>
            <div>
            <div>
                <h3>Les controles elementaires</h3>
                    <form id="form5" class="form_style1"  onsubmit="return validateForm(this)">
                    <!--<label for="username">Username:</label> necessite id sur le champ-->
                    <label>Username:</label>
                    <input type="text" name="username" value="" required placeholder="Saisir le prénom"/>

                    <div class="checkbox">
                        <label>Écailles<input type="checkbox" name="ecailles" checked /></label>
                        <label>Plumes<input type="checkbox" name="plumes" checked /></label>
                    </div>

                    <input type="submit" value="Submit">
                    <div class="form_error1">---</div>
                    </form>                  
                                        
            </div>
            <aside>
                ne pas affecter id pour pouvir remployer nom de champs ?<br/>
                <button onclick="showModal('DIALOG_1')">showModal DIALOG_1</button>
                <button onclick="showModal('DIALOG_2')">showModal DIALOG_2</button>
            </aside>
            </div>
        </section>


    </article>     

</div>

  <dialog id="DIALOG_1" class="cp_dialog">
    <button autofocus onclick="closeModal('DIALOG_1')">Fermer</button>
    <p>Cette boîte de dialogue modale a un arrière-plan festif&nbsp;!</p>
  </dialog>
  
  <dialog id="DIALOG_2" class="cp_dialog">
    <button autofocus onclick="closeModal('DIALOG_2')">Fermer</button>
    <p>Cette seconde boîte de dialogue modale n'est pas indépendante&nbsp;</p>
    <form id="form10" class="form_style1"  onsubmit="return validateForm(this)">

      <label for="fname">First Name</label>
      <input type="text" name="firstname" value="" pattern="[a-zA-Z]{2,50}" placeholder="Saisir le prénom" required minlength="2" maxlength="50"/>

      <label for="lname">Last Name</label>
      <input type="text" name="lastname" placeholder="Your last name..">

      <label for="country">Country</label>
      <select name="country">
        <option value="australia">Australia</option>
        <option value="canada">Canada</option>
        <option value="usa">USA</option>
      </select>
      
      <textarea name="message">Some text...</textarea>
      
      <input type="submit" value="Submit">
    
    </form>        
  </dialog>