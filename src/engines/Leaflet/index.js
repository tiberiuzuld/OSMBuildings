
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
    this._osmb.container.style.position = 'absolute';

    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      L.DomUtil.addClass(this._osmb.container, 'leaflet-zoom-animated');
    } else {
      L.DomUtil.addClass(this._osmb.container, 'leaflet-zoom-hide');
    }

    this._updateOpacity();

    map.on('viewreset', this._reset, this);
    map.on('move', this._move, this);
    map.on('resize', this._resize, this);

    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on('zoomanim', this._animateZoom, this);
    }

    this._reset();
  },

  onRemove: function (map) {
    map.getPanes().overlayPane.removeChild(this._osmb.container);

    map.off('viewreset', this._reset, this);
    map.off('move', this._move, this);
    map.off('resize', this._resize, this);

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
    // TODO
    return this.options.attribution;
  },

  _updateOpacity: function () {
    L.DomUtil.setOpacity(this._osmb.container, this.options.opacity);
  },

  _reset: function () {
    console.log('RESET');

    this._move();
    this._osmb.setZoom(this._map._zoom);

    // var osmbContainer = this._osmb.container;
    // osmbContainer.style.left = 0;
    // osmbContainer.style.top  = 0;
    // osmbContainer.style.width  = size.x + 'px';
    // osmbContainer.style.height = size.y + 'px';
  },

  _resize: function() {
    var osmbContainer = this._osmb.container;
    // osmbContainer.style.width  = this._map._size.x;
    // osmbContainer.style.height = this._map._size.y;
  },

  _move: function(e) {
    var
      pos = this._map.getCenter(),
      osmb = this._osmb;

    osmb.setPosition({ latitude:pos.lat, longitude:pos.lng });
    var offset = L.DomUtil.getPosition(this._map._mapPane);
    osmb.container.style.left = -offset.x + 'px';
    osmb.container.style.top  = -offset.y + 'px';

    // TODO: could also be a zoomchange?
  },

  _animateZoom: function (e) {
    var map = this._map;
    var scale = map.getZoomScale(e.zoom);
    var tx = this._osmb.width  / 2 * (1 - 1/scale);
    var ty = this._osmb.height / 2 * (1 - 1/scale);
    this._osmb.container.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString({ x:tx, y:ty }) + ' scale(' + scale + ') ';
  }

  // _animateZoom: function (e) {
  //   var scale = map.getZoomScale(e.zoom),
  //     nw = this._bounds.getNorthWest(),
  //     se = this._bounds.getSouthEast(),
  //
  //     topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
  //     size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
  //     origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));
  //
  //   image.style[L.DomUtil.TRANSFORM] =
  //     L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
  // },

});

L.osmBuildings = function (options) {
  return new L.OSMBuildings(options);
};
