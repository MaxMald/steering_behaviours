/**
 * Universidad de Artes Digitales, Guadalajara - 2020
 *
 * @summary 
 *
 * @file uiObject.ts
 * @author Max Alberto Solano Maldonado <nuup20@gmail.com>
 * @since November-10-2020
 */

import { MxListener } from "listeners/mxListener";
import { MxListenerManager } from "listeners/mxListenerManager";
import { Master } from "../../master/master";

/**
 *  
 */
export class UIObject
{
  
  /****************************************************/
  /* Public                                           */
  /****************************************************/
  
  constructor()
  {

    // Create the listener manager.

    this._m_listenerManager = new MxListenerManager<UIObject, any>();

    return;

  }

  /**
   * Initialize the Manager. Called by Master when the App before the application
   * was created
   */
  init() 
  : void
  {

    return;

  }

  /**
   * Called by Master, each game loop.
   * 
   * @param _dt delta time in seconds. 
   */
  update( _dt : number )
  : void
  {

    return;

  }

  /**
   * Set the Master Manager
   * 
   * @param _master Master Manager. 
   */
  setMasterManager(_master : Master)
  : void
  {

    return;

  }

  /**
   * Called by Master when the simulation is going to start.
   */
  onSimulationStart()
  : void
  {

    return;

  }

  /**
   * Called by Master when the simulation had been paused.
   */
  onSimulationPause()
  : void
  {

    return;

  }

  /**
   * Called by Master when the game is going to be resumed..
   */
  onSimulationResume()
  : void
  {

    return;

  }

  /**
   * Called by Master when the game is shutdown.
   */
  onSimulationStop()
  : void
  {

    return;

  }

  /**
   * The width of the UI Object.
   */
  getWidth()
  : number
  {

    return 0;

  }

  /**
   * The height of the UI Object.
   */
  getHeight()
  : number
  {

    return 0;

  }

  /**
   * Get the x position of this UI Object.
   */
  getX()
  : number
  {

    return 0;

  }

  /**
   * Get the y position of this UI Object.
   */
  getY()
  : number
  {

    return 0;

  }

  /**
   * Get the depth value.
   */
  getZ()
  : number
  {

    return 0;

  }

  /**
   * Set the depth value.
   *  
   * @param _z depth value. 
   */
  setZ(_z: number)
  : void
  {

    return;

  }

  /**
   * Move the UI Object an amount.
   * 
   * @param _x amount in x axis. 
   * @param _y amount in y axis.
   */
  move(_x: number, _y: number)
  : void
  {

    return;

  }

  /**
   * Set the position of the UI Object.
   * 
   * @param _x position in x axis. 
   * @param _y position in y axis.
   */
  setPosition(_x: number, _y: number)
  : void
  {

    return;

  }

  /**
   * Set the horizontal and vertical anchor (origin) of this UI Object.
   * 
   * @param _x The horizontal anchor (origin) of this UI Object.
   * @param _y The vertical anchor (origin) of this UI Object.
   */
  setAnchor(_x: number, _y: number)
  : void
  {

    return;

  }

  /**
  * Sets the scale of this UIObject.
  * @param _x The horizontal scale of this UIObject.
  * @param _y [optional] The vertical scale of this UIObject. If not set it will use the `_x` value. Default _x.
  */
 setScale(_x: number, _y?: number)
 : void 
 {
   return;
 }

  /**
   * The horizontal anchor (origin) of this UI Object.
   */
  getAnchorX()
  : number
  {

    return 0.5;

  }

  /**
   * The vertical anchor (origin) of this UI Object.
   */
  getAnchorY()
  : number
  {

    return 0.5;

  }

  isEnable()
  : boolean
  {

    return true;

  }

  /**
   * Enable the UI Element.
   */
  enable()
  : void
  {

    return;

  }

  /**
   * Disable the UI Element.
   */
  disable()
  : void
  {

    return;

  }

  /**
   * Subscribe to an event of this UI Object. 
   * 
   * @param _event name of the event.
   * @param _username name of the user.
   * @param _fn callback function.
   * @param _context function context.
   */
  subscribe
  (
    _event: string, 
    _username: string, 
    _fn: (_sender: UIObject, _args: any)=>void, 
    _context: any
  )
  : void
  {

    this._m_listenerManager.suscribe
    (
      _event, 
      _username, 
      new MxListener<UIObject,any>(_fn, _context)
    );

    return;

  }

  /**
   * Unsubscribe from an event of this UI Object.
   * 
   * @param _event name of the event. 
   * @param _username name of the user.
   */
  unsubscribe
  (
    _event: string,
    _username: string
  )
  : void
  {

    this._m_listenerManager.unsuscribe
    (
      _event,
      _username
    );

    return;

  }

  /**
   * Safely destroys this manager.
   */
  destroy()
  : void
  {

    this._m_listenerManager.destroy();

    return;

  }

  /****************************************************/
  /* Protected                                        */
  /****************************************************/  

  protected _m_listenerManager : MxListenerManager<UIObject, any>;

}