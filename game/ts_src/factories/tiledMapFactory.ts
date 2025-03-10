/**
 * Universidad de Artes Digitales, Guadalajara - 2020
 *
 * @summary Provides functions to create phaser game objects from custom TileMap
 * objects.
 *
 * @file tiledMapFactory.ts
 * @author Max Alberto Solano Maldonado <nuup20@gmail.com>
 * @since December-04-2020
 */

import { ST_MANAGER_ID } from "../commons/stEnums";
import { STPoint } from "../commons/stPoint";
import { STRectangle } from "../commons/stRectangle";
import { Ty_TiledObject } from "../commons/stTypes";
import { MotionImage } from "../gameScene/motionImage";
import { AmbienceManager } from "../managers/ambienceManager/ambienceManager";
import { UIButtonImg } from "../managers/uiManager/uiButtonImg";
import { UIComboBox } from "../managers/uiManager/uiComboBox";
import { UILabel } from "../managers/uiManager/uiLabel";
import { UIMenuButton } from "../managers/uiManager/uiMenuButton";
import { UIObject } from "../managers/uiManager/uiObject";
import { UISlider } from "../managers/uiManager/uiSlider";
import { UISpeedometer } from "../managers/uiManager/uiSpeedometer";
import { UISwitch } from "../managers/uiManager/uiSwitch";
import { Master } from "../master/master";

/**
 * Provides functions to create phaser game objects from custom TileMap objects.
 */
export class TiledMapFactory
{

  /****************************************************/
  /* Public                                           */
  /****************************************************/

  static CreateMotionImage
  (
    _object: Ty_TiledObject,
    _scene: Phaser.Scene
  )
  : MotionImage
  {

    // Get properties

    const hProperties = TiledMapFactory.CreatePropertiesMap(_object.properties);

    // Get Frame

    let frame: string | number;

    const objFrame : string = hProperties.get("frame").value;
    const objFrameIdx : number = hProperties.get("frame_idx").value;

    if(objFrame !== "")
    {

      frame = objFrame;

    }
    else
    {

      frame = objFrameIdx;

    }

    // Create Motion Image

    const image = new MotionImage
    (
      _scene,
      _object.x + _object.width * 0.5,
      _object.y - _object.height * 0.5,
      hProperties.get("velocity").value,
      hProperties.get("texture").value,
      frame
    );

    // Get font color.

    let colorString: string = hProperties.get("tint").value;

    // Remove # character and alpha values (three first characters).

    colorString = colorString.substring(3, colorString.length);    

    // Convert to Hex number

    const color: number = parseInt(colorString, 16);

    // Set font color.

    image.setTint(color)

    // Add image to ambience manager.

    const master = Master.GetInstance();

    const ambience = master.getManager<AmbienceManager>
    (
      ST_MANAGER_ID.kAmbienceManager
    );

    ambience.addObject(image);

    return image;

  }

  /**
   * Create a ST Rectangle object
   * 
   * @param _object Tiled object. 
   * @param _scene Phaser scene.
   */
  static CreateRectangle
  (
    _object: Ty_TiledObject,
    _scene: Phaser.Scene
  )
  : STRectangle
  {

    return new STRectangle
    (
      _object.x,
      _object.y,
      _object.width,
      _object.height
    );

  }

  /**
   * Create a ST Rectangle object
   * 
   * @param _object Tiled object. 
   * @param _scene Phaser scene.
   */
  static CreatePoint
  (
    _object: Ty_TiledObject,
    _scene: Phaser.Scene
  )
  : STPoint
  {

    return new STPoint
    (
      _object.x,
      _object.y
    );

  }

  static CreateVideo
  (
    _object: Ty_TiledObject,
    _scene: Phaser.Scene
  )
  : Phaser.GameObjects.Video
  {

    // Get properties

    const hProperties = TiledMapFactory.CreatePropertiesMap(_object.properties);

    const video = _scene.add.video
    (
      _object.x,
      _object.y,
      hProperties.get("key").value as string
    );

    video.setOrigin(0.0, 0.0);
    
    video.setLoop(hProperties.get("loop").value);

    if(hProperties.get("autoPlay").value as boolean)
    {

      video.play();

    }

    return video;

  }

  /**
   * Creates a phaser Bitmap Text game object, from a tiled object. Returns the phaser
   * game object.
   * 
   * @param _object Tiled object. 
   * @param _scene Phaser scene.
   */
  static CreateBitmapText
  (
    _object: Phaser.Types.Tilemaps.TiledObject,
    _scene: Phaser.Scene
  )
  : Phaser.GameObjects.BitmapText
  {

    // Get properties

    const hProperties = TiledMapFactory.CreatePropertiesMap(_object.properties);

    // Create bitmap text

    const bitmapText = _scene.add.bitmapText
    (
      _object.x,
      _object.y,
      hProperties.get("font_key").value,
      _object.text.text,
      hProperties.get("font_size").value
    );

    bitmapText.setOrigin(0, 0);

    // Get font color.

    let colorString: string = hProperties.get("font_color").value;

    // Remove # character and alpha values (three first characters).

    colorString = colorString.substring(3, colorString.length);    

    // Convert to Hex number

    const color: number = parseInt(colorString, 16);

    // Set font color.

    bitmapText.setTint(color);

    // Text wrapping.

    if(_object.text.wrap)
    {

      bitmapText.maxWidth = _object.width;

    }

    return bitmapText;
    
  }
  
  /**
   * Create a phaser image game object, from a tiled object. This function
   * returns the phaser game object.
   * 
   * @param _object Tiled object. 
   * @param _scene Phaser scene.
   */
  static CreateImage
  (
    _object: Phaser.Types.Tilemaps.TiledObject,
    _scene: Phaser.Scene
  )
  : Phaser.GameObjects.Image
  {

    const hProperties = TiledMapFactory.CreatePropertiesMap(_object.properties);

    // Get the texture and frame of this sprite.

    const texture: string = hProperties.get("texture").value;
    let frame: string | number;
    
    if(hProperties.get("frame").value !== "")
    {

      frame = hProperties.get("frame").value;

    }
    else
    {

      frame = hProperties.get("frame_idx").value;

    }

    // Create Phaser Sprite

    const image = _scene.add.image(0, 0, texture, frame);

    // Set common properties

    TiledMapFactory.setGameObjectProperties
    (
      _object,
      image
    );

    // Get font color.

    let colorString: string = hProperties.get("tint").value;

    // Remove # character and alpha values (three first characters).

    colorString = colorString.substring(3, colorString.length);    

    // Convert to Hex number

    const color: number = parseInt(colorString, 16);

    // Set font color.

    image.setTint(color)

    return image;

  }

  /**
   * Create a phaser sprite game object, from a tiled object. This function
   * returns the phaser game object.
   * 
   * @param _object Tiled object. 
   * @param _scene Phaser scene.
   */
  static CreateSprite
  (
    _object: Phaser.Types.Tilemaps.TiledObject,
    _scene: Phaser.Scene
  )
  : Phaser.GameObjects.Sprite
  {

    const hProperties = TiledMapFactory.CreatePropertiesMap(_object.properties);

    // Get the texture and frame of this sprite.

    const texture: string = hProperties.get("texture").value;
    let frame: string | number;
    
    if(hProperties.get("frame").value !== "")
    {

      frame = hProperties.get("frame").value;

    }
    else
    {

      frame = hProperties.get("frame_idx").value;

    }

    // Create Phaser Sprite

    const sprite = _scene.add.sprite(0, 0, texture, frame);

    // Set common properties

    TiledMapFactory.setGameObjectProperties
    (
      _object,
      sprite
    );
    
    // Play animation

    const animation = hProperties.get("animation").value; 

    if( animation !== "")
    {

      sprite.play(animation);

    }

    return sprite;

  }

  static CreateSpeedometer
  (
    _object: Ty_TiledObject,
    _scene: Phaser.Scene
  )
  : UISpeedometer
  {

    const speedometer = new UISpeedometer
    (
      _object.x + _object.width * 0.5,
      _object.y - _object.height * 0.5,
      _scene
    );

    return speedometer;

  }

  static CreateUISwitch
  (
    _object: Ty_TiledObject,
    _scene: Phaser.Scene
  )
  : UISwitch
  {

     // Get custom properties.

     const hProperties = TiledMapFactory.CreatePropertiesMap(_object.properties);

     // properties

     return new UISwitch
     (
      _object.x + _object.width * 0.5,
      _object.y - _object.height * 0.5,
      _scene,
      hProperties.get("isActive").value,
      hProperties.get("enable_texture").value,
      hProperties.get("enable_frame").value,
      hProperties.get("disable_texture").value,
      hProperties.get("disable_frame").value,
      hProperties.get("hover_texture").value,
      hProperties.get("hover_frame").value
     );

  }

  static CreateUIMenuButton
  (
    _object: Ty_TiledObject,
    _scene: Phaser.Scene
  )
  : UIMenuButton
  {

    // Get custom properties.

    const hProperties = TiledMapFactory.CreatePropertiesMap(_object.properties);

    // properties

    const uiMenuButton = new UIMenuButton
    (
      _object.x + _object.width * 0.5,
      _object.y - _object.height * 0.5,
      _scene,
      hProperties.get("label").value,
      TiledMapFactory.GetColorFromString(hProperties.get("font_color").value),
      hProperties.get("texture").value,
      hProperties.get("frame").value,
      TiledMapFactory.GetColorFromString(hProperties.get("fill_color").value)
    );

    return uiMenuButton;

  }

  static CreateUIComboBox
  (
    _object: Ty_TiledObject,
    _scene: Phaser.Scene
  )
  : UIComboBox
  {
    const comboBox = new UIComboBox
    (
      _object.x,
      _object.y - _object.height * 0.5,
      _scene
    );

    return comboBox;

  }

  static CreateUISlider
  (
    _object: Ty_TiledObject,
    _scene: Phaser.Scene
  )
  : UISlider
  {

    // Get custom properties.

    const hProperties = TiledMapFactory.CreatePropertiesMap(_object.properties);

    const slider = new UISlider
    (
      _object.x + _object.width * 0.5,
      _object.y - _object.height * 0.5,
      _scene,
      hProperties.get("min_value").value,
      hProperties.get("max_value").value
    );

    return slider;

  }

  static CreateUILabel
  (
    _object: Ty_TiledObject,
    _scene: Phaser.Scene
  )
  : UILabel
  {

    // Get custom properties.

    const hProperties = TiledMapFactory.CreatePropertiesMap(_object.properties);

    // Get font color.

    const color 
      = TiledMapFactory.GetColorFromString(hProperties.get("font_color").value);

    // Create bitmap text

    const uiLabel = new UILabel
    (
      _object.x,
      _object.y,
      _scene,
      _object.text.text,
      hProperties.get("font_key").value,
      hProperties.get("font_size").value,
      color
    );

    uiLabel.setAnchor(0, 0);

    return uiLabel;

  }

  /**
   * Create an UI Button Image from a tiled object.
   * 
   * @param _object 
   * @param _scene 
   */
  static CreateUIButtonImage
  (
    _object: Phaser.Types.Tilemaps.TiledObject,
    _scene: Phaser.Scene
  )
  : UIButtonImg
  {

    // Get custom properties.

    const hProperties = TiledMapFactory.CreatePropertiesMap(_object.properties);

    const texture: string = hProperties.get("texture").value;
    const frame: string = hProperties.get("frame").value;
    const frameHover: string = hProperties.get("frame_hover").value;
    const framePress: string = hProperties.get("frame_press").value;
    
    // Create Button

    const button = new UIButtonImg
    (
      0, 
      0, 
      _scene,
      frame,
      frameHover,
      framePress,
      texture
    );

    // Set common properties

    TiledMapFactory.setUIProperties(_object, button);

    return button;

  }  

  static GetColorFromString(_color: string)
  : number
  {

    // Remove # character and alpha values (three first characters).

    _color = _color.substring(3, _color.length);    

    // Convert to Hex number

    const color: number = parseInt(_color, 16);

    return color;

  }

  /**
   * Set common properties of a tiled object to a phaser game object.
   * 
   * properties:
   * 
   * * position
   * * scaling
   * * rotation
   * * flipping
   *  
   * @param _tiledObject tiled object.
   * @param _phaserObject phaser game object.
   */
  private static setGameObjectProperties
  (
    _tiledObject: Phaser.Types.Tilemaps.TiledObject,
    _phaserObject : any
  )
  : void
  {

    // Calculate real object position.

    const rotation = _tiledObject.rotation * Phaser.Math.DEG_TO_RAD;

    // The angle of the diagonal line with respect the width length.

    const bAngle = Math.atan(_tiledObject.height / _tiledObject.width);

    // half diagonal

    const vHDiagonal = new Phaser.Math.Vector2
    (
      Math.sqrt(Math.pow(_tiledObject.width * 0.5, 2) + Math.pow(_tiledObject.height * 0.5, 2)),
      0
    );

    // Rotate diagonal by the B angle.

    vHDiagonal.rotate(-bAngle);

    // Rotate diagonal by object rotation.

    vHDiagonal.rotate(rotation);

    const pivotX = vHDiagonal.x + _tiledObject.x;
    const pivotY = vHDiagonal.y + _tiledObject.y;

    // Invert vHDiagonal

    vHDiagonal.scale(-1);

    // Rotate Diagonal by the negative rotation.

    vHDiagonal.rotate(-rotation);

    // Apply vHDiagonal to pivot, and get the original position.

    const objX = pivotX + vHDiagonal.x;
    const objY = pivotY + vHDiagonal.y;

    // Set origin.

    _phaserObject.setOrigin(0.5, 0.5);

    _phaserObject.setPosition
    (
      objX + _tiledObject.width * 0.5,
      objY - _tiledObject.height * 0.5
    );

    _phaserObject.setScale
    (
      _tiledObject.width / _phaserObject.width,
      _tiledObject.height / _phaserObject.height
    );

    _phaserObject.setAngle(_tiledObject.rotation);


    _phaserObject.setFlipX(_tiledObject.flippedHorizontal);
    _phaserObject.setFlipY(_tiledObject.flippedVertical);

    _phaserObject.setVisible(_tiledObject.visible);

    return;

  }

  /**
   * Set common properties of a tiled object to a UI Object.
   * 
   * properties:
   * 
   * * position
   * * scaling
   * * rotation
   * * flipping
   *  
   * @param _tiledObject tiled object.
   * @param _phaserObject phaser game object.
   */
  private static setUIProperties
  (
    _tiledObject: Phaser.Types.Tilemaps.TiledObject,
    _uiObject : UIObject
  )
  : void
  {

    // Calculate real object position.

    const rotation = _tiledObject.rotation * Phaser.Math.DEG_TO_RAD;

    // The angle of the diagonal line with respect the width length.

    const bAngle = Math.atan(_tiledObject.height / _tiledObject.width);

    // half diagonal

    const vHDiagonal = new Phaser.Math.Vector2
    (
      Math.sqrt(Math.pow(_tiledObject.width * 0.5, 2) + Math.pow(_tiledObject.height * 0.5, 2)),
      0
    );

    // Rotate diagonal by the B angle.

    vHDiagonal.rotate(-bAngle);

    // Rotate diagonal by object rotation.

    vHDiagonal.rotate(rotation);

    const pivotX = vHDiagonal.x + _tiledObject.x;
    const pivotY = vHDiagonal.y + _tiledObject.y;

    // Invert vHDiagonal

    vHDiagonal.scale(-1);

    // Rotate Diagonal by the negative rotation.

    vHDiagonal.rotate(-rotation);

    // Apply vHDiagonal to pivot, and get the original position.

    const objX = pivotX + vHDiagonal.x;
    const objY = pivotY + vHDiagonal.y;

    // Set origin.

    _uiObject.setPosition
    (
      objX + _tiledObject.width * _uiObject.getAnchorX(),
      objY - _tiledObject.height * _uiObject.getAnchorY()
    );

    _uiObject.setScale
    (
      _tiledObject.width / _uiObject.getWidth(),
      _tiledObject.height / _uiObject.getHeight()
    );

    //_phaserObject.setAngle(_tiledObject.rotation);

    
    if(!_tiledObject.visible)
    {
      _uiObject.disable();
    }    

    return;

  }
  
  /**
   * Create a map of custom a tiled object's custom properties, with the
   * property name as the key
   * 
   * @param _aProperties array of custom tiled object properties.
   */
  private static CreatePropertiesMap(_aProperties: Array<IObjectProperty>)
  : Map<string, IObjectProperty>
  {
    
    const map = new Map<string, IObjectProperty>();

    const size = _aProperties.length;

    for(let i = 0; i < size; ++i )
    {

      map.set(_aProperties[i].name, _aProperties[i]);

    }

    return map;

  }

}

/**
 * Custom tiled object property interface.
 */
interface IObjectProperty
{

  /**
   * Property name.
   */
  name: string;

  /**
   * Property type.
   */
  type: string;

  /**
   * Property value.
   */
  value: any;

}