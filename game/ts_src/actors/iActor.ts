/**
 * Universidad de Artes Digitales, Guadalajara - 2020
 *
 * @summary Provides a common control for every actor.
 *
 * @file iActor.ts
 * @author Max Alberto Solano Maldonado <nuup20@gmail.com>
 * @since August-30-2020
 */

 /**
  * Provides a common control for every actor.
  */
 export interface IActor
 {
   /****************************************************/
   /* Public                                           */
   /****************************************************/

   /**
    * Initialize the actor.
    */
   init()
   : void;

   /**
    * Update the actor.
    */
   update()
   : void;
   
   /**
    * Send a message.
    * 
    * @param _id message id. 
    * @param _obj message.
    */
  sendMessage(_id : number, _obj : any)
  : void;

  /**
   * Get the actor's name.
   */
  getName()
  : string;

  /**
   * Called when the simulation had started.
   */
  onSimulationStart()
  : void;

  /**
   * Called when the simulation had paused.
   */
  onSimulationPause()
  : void;

  /**
   * Called when the simulation had resumed.
   */
  onSimulationResume()
  : void;

  /**
   * Called when the simulation had stopped.
   */
  onSimulationStop()
  : void;

  /**
   * Called when the debug feature had been enable.
   */
  onDebugEnable()
  : void;

  /**
   * Called when the debug feature had been disable.
   */
  onDebugDisable()
  : void;

  /**
   * Destroy actor.
   */
  destroy()
  : void;
 }
