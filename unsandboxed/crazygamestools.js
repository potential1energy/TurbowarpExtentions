(function(Scratch) {
  'use strict';
  // Initalize the SDK
  var crazysdk = false
  var packager = false;
  if (typeof scaffolding !== 'undefined') {
    crazysdk = window.CrazyGames.CrazySDK.getInstance();
    crazysdk.init();
    packager = true;
  }
  // Define the Extention Class
  class CrazyGamesTools {
    // Setup Variables
    adplaying = false
    aderror = false
    lasttime = 0
    deltatime = 0
    ScratchTimer = 0
    AdDelay = 0
    // AD Calback
    adStarted = () => {
      this.adplaying = true
    }
    adFinished = () => {
      this.adplaying = false
    }
    adError = () => {
      this.aderror = true
    }
    // Crazy SDK
    installListeners() {
      if (packager == true) {
        crazysdk.addEventListener("adStarted", this.adStarted)
        crazysdk.addEventListener("adError", this.adError)
        crazysdk.addEventListener("adFinished", this.adFinished)
      }
    }
    removeListeners() {
      if (packager == true) {
        crazysdk.removeEventListener("adStarted", this.adStarted)
        crazysdk.removeEventListener("adError", this.adError)
        crazysdk.removeEventListener("adFinished", this.adFinished)
      }
    }
    //Functions
    reqad(a) {
      if (packager == true) {
        if (a.TYPE == 'midgame' || a.TYPE == 'rewarded') {
          crazysdk.requestAd(a.TYPE);
        }
      } else {
        this.AdDelay = 0
        this.adplaying = true
      }
    }
    adplayingf() {
      return this.adplaying;
    }
    aderrorf() {
      return this.aderror;
    }
    resetadstat() {
      this.adplaying = false
      this.aderror = false
    }
    initalize(a) {
      this.adplaying = false
      this.aderror = false
      this.installListeners()
    }
    update(a) {
      this.deltatime = a.TIMER - this.lasttime
      this.lasttime = a.TIMER
      this.ScratchTimer = a.TIMER
      if (packager == false && this.adplaying == true) {
        this.AdDelay += this.deltatime
        if (this.AdDelay >= 10) {
          this.adplaying = false
        }
      }
    }
    // Project Definition
    getInfo () {
      return {
        id: 'crazygamestools',

        name: 'Crazy Games Tools',

        blocks: [
          {
            opcode: 'reqad',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Request Ad [TYPE]',
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'typemenu'
              }
            }
          },
          {
            opcode: 'initalize',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Initalize (Put under When Green Flag Clicked)',
          },
          {
            opcode: 'resetadstat',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Reset AD [MENU] to false',
            arguments: {
              MENU: {
                type: Scratch.ArgumentType.STRING,
                menu: 'resetmenu'
              }
            }
          },
          {
            opcode: 'update',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Update | Put Timer Variable Here ->[TIMER] (Put in forever loop)',
            arguments: {
              TIMER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'adplayingf',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is AD playing'
          },
          {
            opcode: 'aderrorf',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is AD Error'
          }
        ],

        menus: {
          typemenu: {
            acceptReporters: true,
            items: ['midgame', 'rewarded']
          },
          resetmenu: {
            items: ['playing','error']
          }
        }
      }
    }
  }
  Scratch.extensions.register(new CrazyGamesTools());
})(Scratch);
