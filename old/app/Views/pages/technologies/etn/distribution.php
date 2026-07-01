<div id="index" class="tabcontent" style="display: block;">

    <article class="cp_soft-card">
        <header>
            <h1>Electrotechnique / Distribution</h1>
            <p>
                <ul>
                    <li><a href="https://elfennel.fr/cv/rwd.html#ETN002A">ETN002A - Postes HTA</a>  
                    <ul>
                        <li><a href="https://elfennel.fr/cv/rwd.html#ETN002A">ETN002A - Postes HTA</a></li>
                        <li><a href="https://elfennel.fr/cv/rwd.html#ETN002B">ETN002B - Cellules haute tension</a></li>
                    </ul>
                    </li> 
                </ul> 
            <br>
             </p>
        </header>
<!-- 

                    <a href="/assets/img/technologies/acp/acp_zt250vsd_h.jpg">
                        <img width="20%" src="/assets/img/technologies/acp/acp_zt250vsd_l.jpg">
                    </a>                
-->
        <section>
            <h2></h2>
            <div>
                <div>


                </div>
                <aside>

                </aside>                
            </div>
        </section>
<!-- 

                    <a href="/assets/img/technologies/acp/acp_zt250vsd_h.jpg">
                        <img width="20%" src="/assets/img/technologies/acp/acp_zt250vsd_l.jpg">
                    </a>                
-->
        <section>
            <h2></h2>
            <div>
                <div>


                </div>
                <aside>

                </aside>                
            </div>
        </section>
    </article>        

</div>


  -->
  <div id="carousel-app3" >

    <div class="w3-row w3-padding-32" id="ETN002">
      <div class="w3-twothird w3-container">
        <h1 class="w3-text-blue">ETN - Distribution électrique</h1>
        <p>
        Certains bâtiments requierent beaucoup d'énergie du fait de leur activité spécifique.
        La haute tension permet de délivrer des puissances importantes et de réduire les pertes sur la distribution.
        Selon les organisations, la distibution électrique se répartit entre réseau HTB, HTA et BT<br/>
        <br/>
        En haute tension les équipements mis en œuvre, les manœuvres sont différentes et plus encadrées du fait du danger important. Les équipements sont contenues dans des locaux électriques ou poste haute tension pour la HTA et à l'éxterieure pour de spostes HTB. La haute tension est distribué par le biais de cellules. Selon les organisations on priviliégie une distribution en boucle ou en antenne<br/>
        <br/>
        Les travaux sous tensions sont interdits en haute tension mais il est possible d'intervenir au voisinage.<br/>
        Les convertisseurs modernes mettent en œuvre des IGBT pouvant supporter 5500V.<br/>
        </p>
        <p>
        Sur le réseau public on distingue trois schémas de raccordement en haute tension
        <ul>
          <li>antenne ou simple dérivation</li>
          <li>bouclage ou coupure d'artère</li>
          <li>double dérivation</li>
        </ul>
        Pour les applications marines la distribution et le spotentiels sont différents du fait de l'environnement et de la nécessité d'alimenter le bord. Certains navires se raccordent directment au reseau HT des ports lors des escales
        </p>

        <p>
          <ul>
            <li><a href="https://elfennel.fr/cv/rwd.html#ETN002A">ETN002A - Postes HTA</a></li>
            <li><a href="https://elfennel.fr/cv/rwd.html#ETN002B">ETN002B - Cellules haute tension</a></li>
          </ul>
        </p>
      </div>
 

      <div class="w3-third w3-container">
      
        <image-carousel :period="3000">
          <a href="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/distrib_htbt.png" target="_blank">
            <img src="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/distrib_htbt.png" alt="Schema WinRelais HTA / BT avec SLT IT" width="100%" />
          </a>

          <a href="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/distribht.png" target="_blank">
            <img src="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/distribht.png" alt="Distribution HTA /BT (Schneider marine)" width="100%" />
          </a>

          <a href="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/poste_eol_1.png" target="_blank">
              <img src="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/poste_eol_1.png" alt="Cellule de transformateur HTA/BT consignée" width="100%" />
          </a>
        </image-carousel>
      </div>
    </div>
    <!-- section -->
    <div class="w3-row w3-padding-32" id="ETN002A">
      <div class="w3-twothird w3-container">
        <h2 class="w3-text-blue">Postes HTA</h2>
        <p>
          Un poste simple,raccordé sur un bouclage HTA 20kV Enedis , distribue la haute tension et alimente le transformateur HTA/BT de l'organisation.
          Le transformateur convertit la haute tension et alimente le tableau basse tension. Cette structure de poste est très utilisé et pemre tde bénéficier des tarifs verts.<br/>
          On trouve trois cellules, deux cellules interrupteurs et une cellule interrupteur et fusible<br/>
          Les cellules interrupteurs sont nécessaires pour l'alimentation depuis le bouclage.<br/>
          La troisième cellule combine les fonctions interrupteurs et fusible. Cette cellule alimente le transformateur et en assure la protection.<br/>
          <br/>
          Les cellules peuvent être équipés pour le comptage et la mesure. Une protection contre les défauts d'isolements HT est implanté pour ENEDIS
        </p>

        <p>Sur un poste plus important, décrit dans <a href="https://elfennel.fr/cv/rwd.html#ETN001">ETN - Centrale électrique</a>.Le poste est alimenté depuis un bouclage ENEDIS et doit injecter de l'énergie sur le réseau en cas de besoin.<br>
        Il est constitué par :
        <ul>
          <li>deux cellules de bouclage</li>
          <li>une cellule de comptage</li>
          <li>une cellule interrupteur fusible (auxiliaires)</li>
          <li>une cellule de mesure( synchronisation et comptage)</li>
          <li>le disjoncteur général haute tension</li>
          <li>5 cellules disjoncteurs, une par groupe électrogène</li>
        </ul>
        Chaque groupe électrogène dispose d'un transformateur élévateur raccordé sur l’alternateur.Les transformateurs sont raccordés aux cellules disjoncteurs équipés de relais de protection SEPAM
        </p>

      </div>
      <div class="w3-third w3-container">
        <!-- 
          <image-carousel :period="3000"></image-carousel>
            
            <img 
              src="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/hv_poste_tgbt.png" 
              alt="Poste de livraison HTA/BT sur une boucle HT"
              width="100%" /></a>

           -->
        <a href="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/hv_poste_tgbt.png" target="_blank">
            <img 
              src="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/hv_poste_tgbt.png" 
              alt="Poste de livraison HTA/BT sur une boucle HT" 
              width="60%" /></a>


        <a href="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/poste_caud_1.png" target="_blank">
            <img 
              src="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/poste_caud_1.png"
              alt="Poste de distribution HTA"
              width="60%" /></a>
      </div>
    </div> 
    <!-- fin section -->
    <!-- section 
      hv_cell_io.png]
      hv_cell_eqp.png]
    -->
    <div class="w3-row w3-padding-32" id="ETN002B">
      <div class="w3-twothird w3-container">
        <h2 class="w3-text-blue">Cellules haute tension</h2>
        <p>Ci dessus une cellule Schneider SM6. La cellule réalise la fonction interrupteur et fusible.<br/>
        L'interrupteur (repère 1) est raccordé au jeu de barres (repère 2) par le haut et connecté au fusible (en bas a gauche, en gris) par le dessous<br/>
        Les cellules haute tension sont interconnectées entre elles par un jeu de barres (repère 2)<br/>
        Le raccordement vers le transformateur se fait en partie basse (repère 3). Les alimentations sont aussi raccordées en partie basse contrairement à la basse tension.<br/>
        Le panneau de commande (repère 4) permet de réaliser les manœuvres sur la cellules.<br/>
        Un panneau de contrôle (repère 5) permet de récupérer les états des équipements la cellule et de l'actionner.<br/>
        </p>

          <h3 class="w3-text-blue">Composants et fonctions</h3>
          Les équipements constituants les cellules et leurs fonctions.
          On retrouves des équipements déjà abordé en basse tension:
          <ul>
          <li>sectionneur</li>
          <li>interrupteur</li>
          <li>interrupteur sectionneur</li>
          <li>disjoncteur</li>
          <li>fusibles</li>
          <li>contacteur</li>
          </ul>
          Les fonctions des équipements HT sont les mêmes qu'en basse tension
          <ul>
          <li>protection</li>
          <li>manœuvre</li>
          <li>séparation</li>
          </ul>
          Des fonctions de mesure, comptage et protection peuvent être ajouté dans les cellules.

          <h3 class="w3-text-blue">Automatisme</h3>
          Selon les cellules et les équipements installés on trouve des entrées et sorties permettant d'assurer le contrôle et la commande. Ci contre, le détail du bornier de la cellule interrupteur et fusible<br/>
          Les contacts renvoie l'état de l'interrupteur, du fusible et du sectionneur de terre.<br/>
          Deux bobines permettent de commander l'ouverture et la fermeture de l'interrupteur.<br/>

          <h3 class="w3-text-blue">Vidéos</h3>
          
          <a href="https://www.youtube.com/watch?v=z5iqEyrSU6w" target="_blank">
          Raccordement des câbles BT et HT sur le transformateur</a>


        </p>
      </div>
      <div class="w3-third w3-container">
        <a href="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/hv_cell_descr.png" target="_blank">
            <img src="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/hv_cell_descr.png" alt="Description cellule SM6" width="100%" />
        </a>
        <image-carousel :period="3000">
            <a href="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/hv_cell_eqp.png" target="_blank">
              <img 
                src="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/hv_cell_eqp.png"
                alt="Symbole des equipements de distribution HT"
                width="100%" /></a>



            <a href="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/hv_cell_io2.png" target="_blank">
              <img 
                src="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/hv_cell_io2.png"
                alt="Les entrées sorties disponible sur une cellule HT sans légende"
                width="100%" /></a>
        </image-carousel>
           <!--      
            <a href="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/hv_cell_io.png" target="_blank">
              <img 
                src="https://elfennel.fr/media/images/CLASSES/ELECTROTECH/Hta/hv_cell_io.png" 
                alt="Les entrées sorties disponible ssur une cellule HT avec légende" 
                width="100%" /></a>-->
      </div>
    </div> 
   <!-- fin section -->
  </div><!-- end ETN002 - Distribution électique-->
  
