/**
 * Universidad de Artes Digitales, Guadalajara - 2020
 *
 * @summary 
 *
 * @file iManager.ts
 * @author Max Alberto Solano Maldonado <nuup20@gmail.com>
 * @since September-07-2020
 */

import { Master } from "../master/master";

/**
 * Provides a common interface for each manager.
 */
export interface IManager
{
  /**
   * Initialize the Manager. Called by Master when the App before the application
   * was created
   */
  init() 
  : void;

  /**
   * Called by Master, each game loop.
   * 
   * @param _dt delta time in seconds. 
   */
  update( _dt : number )
  : void;

  /**
   * Receive a message.
   * 
   * @param _id id. 
   * @param _msg message.
   */
  receive(_id : number, _msg : any)
  : void;

  /**
   * Set the Master Manager
   * 
   * @param _master Master Manager. 
   */
  setMasterManager(_master : Master)
  : void;

  /**
   * Get this Manager ID.
   */
  getID()
  : number;

  /**
   * Called by Master when all managers had been created.
   */
  onPrepare()
  : void;

  /**
   * Called by Master when a game scene is been created.
   * @param _scene 
   */
  onSceneCreate(_scene: Phaser.Scene)
  : void;

  /**
   * Called by Master when a game scene is been destroyed.
   * @param _scene 
   */
  onSceneDestroy(_scene: Phaser.Scene)
  : void;

  /**
   * Called by Master when the simulation scene  is been created.
   */
  onSimulationSceneCreate(_scene : Phaser.Scene)
  : void;

  /**
   * Called by Master when the simulation scene is been destroyed.
   */
  onSimulationSceneDestroy(_scene : Phaser.Scene)
  : void;

  /**
   * Called by Master when the simulation is going to start.
   */
  onSimulationStart()
  : void;

  /**
   * Called by Master when the simulation had been paused.
   */
  onSimulationPause()
  : void;

  /**
   * Called by Master when the game is going to be resumed..
   */
  onSimulationResume()
  : void;

  /**
   * Called by Master when the game is shutdown.
   */
  onSimulationStop()
  : void;

  /**
   * Called by Master when the debug feature is enabled.
   */
  onDebugEnable()
  : void;

  /**
   * Called by Master when the debug feature is disable.
   */
  onDebugDisable()
  : void;

  /**
   * Safely destroys this manager.
   */
  destroy()
  : void;
}