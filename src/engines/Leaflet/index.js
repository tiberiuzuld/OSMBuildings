
L.OSMBuildings = L.Class.extend({
  includes: [L.Mixin.Events, OSMBuildings.prototype],

  options: {
    opacity: 0.8
  },

  initialize: function (options) {
    L.setOptions(this, options);
    this._osmb = new OSMBuildings(options);
  },

  onAdd: function (map) {
    this._map = map;
    this._osmb.appendTo(map._panes.overlayPane, map._size.x, map._size.y);

    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      L.DomUtil.addClass(this._osmb.container, 'leaflet-zoom-animated');
    } else {
      L.DomUtil.addClass(this._osmb.container, 'leaflet-zoom-hide');
    }

    this._updateOpacity();

    map.on('viewreset', this._reset, this);
    map.on('move', this._move, this);
    map.on('zoom', this._zoom, this);

    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on('zoomanim', this._animateZoom, this);
    }

    this._reset();
  },

  onRemove: function (map) {
    map.getPanes().overlayPane.removeChild(this._osmb.container);

    map.off('viewreset', this._reset, this);
    map.off('move', this._move, this);
    map.off('zoom', this._zoom, this);

    if (map.options.zoomAnimation) {
      map.off('zoomanim', this._animateZoom, this);
    }
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  setOpacity: function (opacity) {
    this.options.opacity = opacity;
    this._updateOpacity();
    return this;
  },

  bringToFront: function () {
    if (this._osmb.container) {
      this._map._panes.overlayPane.appendChild(this._osmb.container);
    }
    return this;
  },

  bringToBack: function () {
    var pane = this._map._panes.overlayPane;
    if (this._osmb.container) {
      pane.insertBefore(this._osmb.container, pane.firstChild);
    }
    return this;
  },

  getAttribution: function () {
    return this.options.attribution;
  },

  _animateZoom: function (e) {
    // var map = this._map,
    //   image = this._osmb.container,
    //   scale = map.getZoomScale(e.zoom),
    //
    //   topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
    //   size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
    //   origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));
    //
    // image.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
  },

  _reset: function () {
    // L.DomUtil.setPosition(this._osmb.container, [0, 0]);
    // this._osmb.container.style.width  = size.x + 'px';
    // this._osmb.container.style.height = size.y + 'px';
  },

  _updateOpacity: function () {
    L.DomUtil.setOpacity(this._osmb.container, this.options.opacity);
  },

  _move: function(e) {
    var pos = this._map.getCenter();
    this._osmb.setPosition({
      latitude:pos.lat,
      longitude:pos.lng
    });

    // var off = this.getOffset();
    // moveCam({ x:this.offset.x-off.x, y:this.offset.y-off.y });
  },

  _zoom: function(e) {
    this._osmb.setZoom(this._map.getZoom());
    // var off = this.getOffset();
    // moveCam({ x:this.offset.x-off.x, y:this.offset.y-off.y });
  }

});

L.osmBuildings = function (options) {
  return new L.OSMBuildings(options);
};



/***
  var
    off = this.getOffset(),
    po = map.getPixelOrigin();
  setSize({ width:map._size.x, height:map._size.y });
  setOrigin({ x:po.x-off.x, y:po.y-off.y });
  setZoom(map._zoom);

  Layers.setPosition(-off.x, -off.y);

  map.on({
    move:      this.onMove,
    moveend:   this.onMoveEnd,
    zoomstart: this.onZoomStart,
    zoomend:   this.onZoomEnd,
    resize:    this.onResize,
    viewreset: this.onViewReset,
    click:     this.onClick
  }, this);

  if (map.attributionControl) {
    map.attributionControl.addAttribution(ATTRIBUTION);
  }



this.offset = { x:0, y:0 };

L.OSMBuildings.prototype.onRemove = function() {
  var map = this.map;
  if (map.attributionControl) {
    map.attributionControl.removeAttribution(ATTRIBUTION);
  }

  map.off({
    move:      this.onMove,
    moveend:   this.onMoveEnd,
    zoomstart: this.onZoomStart,
    zoomend:   this.onZoomEnd,
    resize:    this.onResize,
    viewreset: this.onViewReset,
    click:     this.onClick
  }, this);

  if (map.options.zoomAnimation) {
    map.off('zoomanim', this.onZoom, this);
  }
  Layers.remove();
  map = null;
};

L.OSMBuildings.prototype.onMoveEnd = function(e) {
  if (this.noMoveEnd) { // moveend is also fired after zoom
    this.noMoveEnd = false;
    return;
  }

  var
    map = this.map,
    off = this.getOffset(),
    po = map.getPixelOrigin();

  this.offset = off;
  Layers.setPosition(-off.x, -off.y);
  moveCam({ x:0, y:0 });

  setSize({ width:map._size.x, height:map._size.y }); // in case this is triggered by resize
  setOrigin({ x:po.x-off.x, y:po.y-off.y });
  onMoveEnd(e);
};

L.OSMBuildings.prototype.onZoomStart = function(e) {
  onZoomStart(e);
};

L.OSMBuildings.prototype.onZoom = function(e) {
//    var map = this.map,
//        scale = map.getZoomScale(e.zoom),
//        offset = map._getCenterOffset(e.center).divideBy(1 - 1/scale),
//        viewportPos = map.containerPointToLayerPoint(map.getSize().multiplyBy(-1)),
//        origin = viewportPos.add(offset).round();
//
//    this.container.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString((origin.multiplyBy(-1).add(this.getOffset().multiplyBy(-1)).multiplyBy(scale).add(origin))) + ' scale(' + scale + ') ';
//    isZooming = true;
};

L.OSMBuildings.prototype.onZoomEnd = function(e) {
  var
    map = this.map,
    off = this.getOffset(),
    po = map.getPixelOrigin();

  setOrigin({ x:po.x-off.x, y:po.y-off.y });
  onZoomEnd({ zoom:map._zoom });
  this.noMoveEnd = true;
};

L.OSMBuildings.prototype.onResize = function() {};

L.OSMBuildings.prototype.onViewReset = function() {
  var off = this.getOffset();

  this.offset = off;
  Layers.setPosition(-off.x, -off.y);
  moveCam({ x:0, y:0 });
};

L.OSMBuildings.prototype.getOffset = function() {
  return L.DomUtil.getPosition(this.map._mapPane);
};
***/