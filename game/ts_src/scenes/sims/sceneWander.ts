/**
 * Universidad de Artes Digitales, Guadalajara - 2020
 *
 * @summary Scene for the Wander force behavior.
 *
 * @file sceneWander.ts
 * @author Jorge Alexandro Zamudio Arredondo <alexzamudio_11@hotmail.com>
 * @since October-24-2020
 */

import { ST_COMPONENT_ID, ST_MANAGER_ID, ST_MESSAGE_ID } from "../../commons/stEnums";
import { CmpForceController } from "../../components/cmpforceController";
import { ShipFactory } from "../../factories/shipFactory";
import { SceneUIFactory } from "../../factories/uiSceneFactory";
import { MapScene } from "../../gameScene/mapScene";
import { AmbienceManager } from "../../managers/ambienceManager/ambienceManager";
import { DebugManager } from "../../managers/debugManager/debugManager";
import { SimulationManager } from "../../managers/simulationManager/simulationManager";
import { UIInfoBox } from "../../managers/uiManager/uiControllers/UIInfoBox";
import { UIManager } from "../../managers/uiManager/uiManager";
import { Master } from "../../master/master";
import { WanderForce } from "../../steeringBehavior/forceWander";

export class ScnWander
extends Phaser.Scene
{
  /****************************************************/
  /* Public                                           */
  /****************************************************/
  
  create()
  : void
  {

    // Camera fade in

    this.cameras.main.fadeIn(500, 0, 0, 0);

    ///////////////////////////////////
    // Master Manager

    this._m_master = Master.GetInstance();

    const master = this._m_master;

    // Master callback: "onSceneCreate" for each manager.

    master.onSceneCreate(this);

    // On simulation scene create.

    master.onSimulationSceneCreate(this);

    /****************************************************/
     /* Ambient                                          */
     /****************************************************/

     const ambienceMap = MapScene.CreateFromTiledMap("ambience_07", this);

     ambienceMap.clear();
     ambienceMap.destroy();

    // Get simulation manager.

    let simManager : SimulationManager = master.getManager<SimulationManager>
    (
      ST_MANAGER_ID.kSimManager
    );

    // Get canvas size.
  
    let canvas = this.game.canvas;
  
    let width : number = canvas.width;
    let height : number = canvas.height;    
    
    ///////////////////////////////////
    // Create SpaceShip Actor

    // Create Actor.

    let shipActor = ShipFactory.CreateBlueShip(this, "Blue Ship");
    // Add Actor to simulation manager.

    simManager.addActor(shipActor);

    // Set Actor max speed.

    shipActor.sendMessage
    (
      ST_MESSAGE_ID.kSetMaxSpeed,
      50
    );

    ///////////////////////////////////
    // Create a Force

    // Create the force.

    let wander : WanderForce = new WanderForce();

    // Init the force.

    wander.init
    (
      shipActor.getWrappedInstance(),
      75,
      25,
      5,
      45,
      100
    );
    
    // Get Force Actor component.
    
    let shipController = shipActor.getComponent<CmpForceController>
    (
      ST_COMPONENT_ID.kForceController
    );

    shipController.addForce('wander_1', wander);

    /****************************************************/
     /* Foreground Ambience                              */
     /****************************************************/

     const ambienceMng = master.getManager<AmbienceManager>
     (
       ST_MANAGER_ID.kAmbienceManager
     );

     ambienceMng.createStarDust(this);

    /****************************************************/
    /* Debug Manager                                    */
    /****************************************************/

    const debugManager = master.getManager<DebugManager>
    (
      ST_MANAGER_ID.kDebugManager
    );

    debugManager.prepareDebugManager(this);

    /****************************************************/
    /* UI                                               */
    /****************************************************/    
    
    // Get UI Manager
    
    const uiManager = master.getManager<UIManager>(ST_MANAGER_ID.kUIManager);

    // Create the Simulation Map Scene

    SceneUIFactory.CreateSimulationUIScene
    (
      "simulation_ui",
      this,
      uiManager,
      this._openSceneInfo,
      this
    );

    // Set the active actor of the UI Manager.

    uiManager.setTarget(shipActor);

    // Display info

    this._openSceneInfo();
    
    ///////////////////////////////////
    // Set simulation to stop state
 
    this._m_master.stopSimulation();
    
    return;

  }

  update(_time : number, _delta : number)
   : void
   {
     // Update Master

     this._m_master.update(_time, _delta * 0.001);

     return;
   }

  /****************************************************/
  /* Private                                          */
  /****************************************************/

  /**
    * Open the scene information box.
    */
   private _openSceneInfo()
   : void
   {

    // Pause Simulation.

    const master = this._m_master;

    master.pauseSimulation();

    // Get the UI Manager.

    const uiManger = master.getManager<UIManager>
    (
      ST_MANAGER_ID.kUIManager
    );

    // Get the info box.

    const infoBox = uiManger.getUIController("infoBox") as UIInfoBox;

    // Set the book.

    infoBox.setBook("wander");

    // Open info box.

    infoBox.open();

    return;

   }
  
  private _m_master : Master;
}