/**
 * Universidad de Artes Digitales, Guadalajara - 2020
 *
 * @summary 
 *
 * @file UIForceSeek.ts
 * @author Max Alberto Solano Maldonado <nuup20@gmail.com>
 * @since November-12-2020
 */

import { ST_COLOR_ID, ST_STEER_FORCE } from "../../../commons/stEnums";
import { SeekForce } from "../../../steeringBehavior/forceSeek";
import { IForce } from "../../../steeringBehavior/iForce";
import { UIBox } from "../uiBox/uiBox";
import { UILabel } from "../uiLabel";
import { UIObject } from "../uiObject";
import { UISlider } from "../uiSlider";
import { UIForce } from "./UIForce";

export class UIForceSeek
extends UIForce
{

  constructor(_scene : Phaser.Scene)
  {

    super();    

    // Create the box
    
    const box = UIBox.CreateForceBox(0,0,_scene);

    box.setClearBox(true);

    box.setPadding(0);

    this._m_box = box;

    // Title

    const title = UILabel.CreateStyleB(0, 0, _scene, "Seek Force", 25);

    title.setTint(ST_COLOR_ID.kGold);

    this._m_title = title;

    box.add(title);

    // Force Magnitude label

    this._m_labelForce = UILabel.CreateStyleB(0, 0, _scene, "#");

    this._m_labelForce.setTint(ST_COLOR_ID.kSkyBlueNeon);

    box.add(this._m_labelForce);

    // Maximum Force Label.

    this._m_maxMagnitude = UILabel.CreateStyleB(0, 0, _scene, "#");

    this._m_maxMagnitude.setTint(ST_COLOR_ID.kSkyBlueNeon);

    box.add(this._m_maxMagnitude);

    // Maximum Force Slider.

    this._m_forceSlider = new UISlider
    (
      0,
      0,
      _scene,
      1,
      9999
    );

    this._m_forceSlider.subscribe
    (
      "valueChanged",
      "UIForceSeek",
      function(_sender: UIObject, _args: any)
      {

        const slider = _sender as UISlider;

        const maxMagnitude = slider.getValue();

        this.setMaximumMagnitudeLabel(maxMagnitude);

        if(this._m_seek !== undefined)
        {

          this._m_seek.setMaxMagnitude(maxMagnitude);

        }

        return;

      },
      this
    );

    box.add(this._m_forceSlider);

    // Set target.

    this.setTarget(undefined);

    return;

  }

  update()
  : void
  {

    if(this._m_seek !== undefined)
    {

      this.setForceLabel(this._m_seek.getActualForce());
    
    }

    return;

  }

  setTarget(_force: IForce)
  : void
  {   

    // Save value.

    this._m_seek = _force as SeekForce;

    if(this._m_seek !== undefined)
    {

      if(_force.getType() !== ST_STEER_FORCE.kSeek)
      {

        throw new Error("UI Seek Force: Incorrect force.");

      }

      this.setForceLabel(this._m_seek.getActualForce());

      this._m_forceSlider.setValue(this._m_seek.getMaxMagnitude());

    }

    return;

  }

  onSimulationStop()
  : void
  {    
    this._m_forceSlider.setValue(this._m_seek.getInitMaxMagnitude());

    return;
  }

  setMaximumMagnitudeLabel(_maxForce: number)
  : void
  {

    this._m_maxMagnitude.setText("Max. Magnitude: " + _maxForce.toFixed(2) + " uN.");

    return;

  }

  setForceLabel(_force: number)
  :void
  {

    this._m_labelForce.setText("Force Magnitude: " + _force.toFixed(2) + " uN.");

    return;

  }

  getBox()
  : UIBox
  {

    return this._m_box;

  }

  destroy()
  {

    this._m_box.destroy();

    this._m_seek = undefined;

    super.destroy();

    return;

  }

  /****************************************************/
  /* Private                                          */
  /****************************************************/
  
  /**
   * Reference to the force.
   */
  private _m_seek: SeekForce;

  // UI Elements.

  private _m_box: UIBox;

  private _m_title: UILabel;

  private _m_labelForce: UILabel;

  private _m_maxMagnitude: UILabel;

  private _m_forceSlider: UISlider;

}