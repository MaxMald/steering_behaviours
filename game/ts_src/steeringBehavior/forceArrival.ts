/**
 * Universidad de Artes Digitales, Guadalajara - 2020
 *
 * @summary 
 *
 * @file forceArrival.ts
 * @author Jorge Alexandro Zamudio Arredondo <alexzamudio_11@hotmail.com>
 * @since September-14-2020
 */

import { Master } from "../master/master";
import { DebugManager } from "../managers/debugManager/debugManager";
import 
{
  ST_COLOR_ID, 
  ST_MANAGER_ID, 
  ST_SIM_SATE, 
  ST_STEER_FORCE 
} from "../commons/stEnums";
import { Ty_Sprite, V2 } from "../commons/stTypes";
import { CmpForceController } from "../components/cmpForceController";
import { IForce } from "./iForce";
import { SimulationManager } from "../managers/simulationManager/simulationManager";
import { ForceInitState } from "./forceInitState";
import { ArrivalInitState } from "./arrivalInitState";

/**
 * 
 */
export class ArrivalForce
implements IForce
{
  /****************************************************/
  /* Public                                           */
  /****************************************************/

  /**
   * Initialize the Arrival Force.
   * 
   * @param _self The sprite of the agent.
   * @param _target The sprite of the target.
   * @param _arrivalRadius The limit radius to start slowing down the force.
   * @param _force The magnitude of the force.
   * @param _controller [optional] The controller of this force.
   */
  init
  (
    _self : Ty_Sprite,
    _target : Ty_Sprite,
    _arrivalRadius : number,
    _force : number,
    _controller ?: CmpForceController
  )
  {
    
    // Get variables

    this._m_self = _self;
    this._m_target = _target;
    this._m_arrivalRadius = _arrivalRadius;
    this._m_forceMagnitude = _force;

    if(this._m_controller !== undefined)
    {
      this._m_controller = _controller;
    }

    this._m_v2_desiredVelocity = new Phaser.Math.Vector2(0.0, 0.0);

    this._m_v2_arrivalForce = new Phaser.Math.Vector2(0.0, 0.0);

    // Get Managers

    const master = Master.GetInstance();

    this._m_simulationManager = master.getManager<SimulationManager>
    (
      ST_MANAGER_ID.kSimManager
    );

    this._m_arrivalInitState = new ArrivalInitState();
    this._m_arrivalInitState.m_initMaxMagnitude = _force;
    this._m_arrivalInitState.m_initArrivalRadius = _arrivalRadius;

    // Get debug manager

    this._m_debugManager = Master.GetInstance().getManager<DebugManager>
    (
      ST_MANAGER_ID.kDebugManager
    );

    return;

  }

  /**
   * Set the controller of this force.
   * 
   * @param _controller Force controller.
   */
  setController(_controller: CmpForceController)
  : void 
  {
    
    this._m_controller = _controller;
    
    return;

  }

  /**
   * Updates this force.
   * 
   * @param _dt delta time in seconds. 
   */
  update(_dt: number)
  : void 
  {
    
    // Get points

    const target : Ty_Sprite = this._m_target;
    
    const self : Ty_Sprite = this._m_self;
    
    // Get controller information.

    const controller = this._m_controller;

    // Current Force
    
    const actualVelocity = controller.getVelocity();

    // Desire Force    

    const forceMagnitude = this._m_forceMagnitude;

    const desiredVelocity = this._m_v2_desiredVelocity;

    desiredVelocity.set
    (
      target.x - self.x, 
      target.y - self.y
    );

    this._m_distance = desiredVelocity.length();

    let arrivalRadius = this._m_arrivalRadius;

    let arrivalMultiplier = this._m_distance / arrivalRadius;

    if(this._m_distance < arrivalRadius) 
    {

      desiredVelocity.setLength(forceMagnitude * arrivalMultiplier);
    
    } 
    else 
    {

      desiredVelocity.setLength(forceMagnitude);
    
    }

    // Steer Force

    let steerForce = this._m_v2_arrivalForce;
   
    steerForce.copy(desiredVelocity).subtract(actualVelocity);   

    // Truncate force    

    steerForce.limit(forceMagnitude);

    // Add force to the controller.

    controller.addSteerForce(steerForce.x, steerForce.y);

    return;

  }

  /**
   * Updates the debugging logic. Called only when the debugging feature is 
   * enable.
   * 
   * @param _dt delta time in seconds.
   */
  updateDebug(_dt : number)
  : void
  {
    
    // Get debug manager

    let debugManager = this._m_debugManager;

    // Get agent

    let sprite = this._m_self;

    // Get target

    let target = this._m_target;

     // Steering force line

     debugManager.drawLine
     (
      this._m_controller.getVelocity().x + sprite.x,
      this._m_controller.getVelocity().y + sprite.y,
      this._m_v2_desiredVelocity.x + sprite.x,
      this._m_v2_desiredVelocity.y + sprite.y,
      DebugManager.FORCE_LINE_WIDTH,
      ST_COLOR_ID.kRed
    );

    // Desired Velocity line

    debugManager.drawLine
    (
      sprite.x,
      sprite.y,
      this._m_v2_desiredVelocity.x + sprite.x,
      this._m_v2_desiredVelocity.y + sprite.y,
      DebugManager.FORCE_LINE_WIDTH,
      ST_COLOR_ID.kOrange
    );

    // Slowing radius circle
    
    debugManager.drawCircle
    (
      target.x,
      target.y,
      this._m_arrivalRadius,
      DebugManager.FORCE_CIRCLE_WIDTH,
      ST_COLOR_ID.kSkyBlueNeon
    );

    if(this._m_distance < this._m_arrivalRadius) 
    {
      sprite.setTint(0x3D85C6);
    } 
    else 
    {
      sprite.clearTint();
    }

    return;
  }

  /**
   * Called when the debugging feature had been enable.
   */
  onDebugEnable()
  : void 
  {
    // TODO
    return;
  }

  /**
   * Called when the debugging feature had been disable.
   */
  onDebugDisable()
  : void 
  {
    this._m_self.clearTint();
    return;
  }

  onSimulationStop()
  : void
  {
    this.setInitMaxMagnitude();
    this.setInitArrivalRadius();

    return;
  }

  /**
   * Get the type of this force.
   */
  getType()
  : number
  {

    return ST_STEER_FORCE.kArrive;

  }

  getInitMaxMagnitude()
  : number
  {
    return this._m_arrivalInitState.m_initMaxMagnitude;
  }

  getMaxMagnitude()
  : number
  {

    return this._m_forceMagnitude;

  }

  setInitMaxMagnitude()
  : void
  {
    this._m_forceMagnitude = this.getInitMaxMagnitude();

    return;
  }

  setMaxMagnitude(_magnitude: number)
  : void
  {

    if(this._m_simulationManager.getState() === ST_SIM_SATE.kStopped)
    {
      this._m_arrivalInitState.m_initMaxMagnitude = _magnitude;
    }

    this._m_forceMagnitude = _magnitude;

    return;

  }

  setInitArrivalRadius()
  : void
  {
    this._m_arrivalRadius = this.getInitArrivalRadius();

    return;
  }

  setArrivalRadius(_radius: number)
  : void
  {

    if(this._m_simulationManager.getState() === ST_SIM_SATE.kStopped)
    {
      this._m_arrivalInitState.m_initArrivalRadius = _radius;
    }

    this._m_arrivalRadius = _radius;

    return;

  }

  getInitArrivalRadius()
  : number
  {
    return this._m_arrivalInitState.m_initArrivalRadius;
  }

  getArrivalRadius()
  : number
  {

    return this._m_arrivalRadius;

  }

  getActualForce()
  : number
  {

    return this._m_v2_arrivalForce.length();

  }

  /**
   * Safely destroys this force.
   */
  destroy()
  : void 
  {

    this._m_controller = null;
    this._m_v2_arrivalForce = null;
    this._m_v2_desiredVelocity = null;

    this._m_debugManager = null;

    this._m_target = null;
    this._m_self = null;

    this._m_arrivalInitState = null;

    this._m_simulationManager = null;
    
    return;
  }
  
  /****************************************************/
  /* Private                                          */
  /****************************************************/
  
  /**
  * Reference to the debug manager.
  */
  private _m_debugManager : DebugManager;

  /**
   * Reference to the simulation manager.
   */
  private _m_simulationManager: SimulationManager;

  private _m_arrivalInitState : ArrivalInitState;

  /**
   * Reference to the force controller.
   */
  private _m_controller : CmpForceController;

  /**
   * The force in Vector2.
   */
  private _m_v2_arrivalForce : V2;

  /**
   * The limit radius to start slowing down the force.
   */
  private _m_arrivalRadius : number;

  /**
   * The magnitude of the applied force.
   */
  private _m_forceMagnitude : number;

  /**
   * The agent sprite.
   */
  private _m_self : Ty_Sprite;

  /**
   * The target sprite.
   */
  private _m_target : Ty_Sprite;

  /**
   * Vector 2 for desired velocity.
   */
  private _m_v2_desiredVelocity : V2;

  /**
   * Distance to target.
   */
  private _m_distance : number;
}