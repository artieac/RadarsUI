'use strict'
import jQuery from 'jquery';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect, useSelector, useDispatch } from "react-redux"
import { useParams } from 'react-router-dom'
import { doesStateHaveValidCurrentRadar } from 'Redux/RadarReducer'
import radarTemplateReducer from 'Redux/RadarTemplateReducer'
import { addRadarTemplatesToState} from 'Redux/RadarTemplateReducer'
import { RadarRepository } from 'Repositories/RadarRepository'
import { RadarTemplateRepository } from 'Repositories/RadarTemplateRepository'
import { addRadarsToState, setCurrentRadarInstanceToState } from 'Redux/RadarReducer'
import { setSelectedRadarItem } from '../../../redux/RadarItemReducer'
import { isValid } from 'Apps/Common/Utilities'
import CompleteRadarManager from '../CompleteRadarManager'

export const RadarViewControl = ({ handleClickRadarItem, isPublic, userId  }) => {
    const currentRadar = useSelector((state) => state.radarReducer.currentRadar);

    const dispatch = useDispatch();

    const isRadarValid = (testRadar) => {
        if(isValid(testRadar)){
            if(testRadar.id!==undefined){
                return true;
            } else {
                return false;
            }
        }
    }

    const getRadarArcs = (sourceRadar) => {
        var retVal = [];

        if(isValid(sourceRadar)){
            for(var i = 0; i < sourceRadar.radarArcs.length; i++){
                retVal.push({"r": sourceRadar.rangeWidth * (i + 1), "name": sourceRadar.radarArcs[i].radarRing.name});
            }
        }

        return retVal;
    }

    const initializeRadar = (h, w, radar_data, radar_arcs, handleClickRadarItem) => {
        jQuery('#title').text(document.title);

        var radar = new pv.Panel()
             .width(w)
             .height(h)
             .canvas('radar')

       // arcs
       radar.add(pv.Dot)
              .data(radar_arcs)
              .left(w/2)
              .bottom(h/2)
              .radius(function(d){return d.r;})
              .strokeStyle("#ccc")
              .anchor("top")
              .add(pv.Label).text(function(d) { return d.name;});

       //quadrant lines -- vertical
       radar.add(pv.Line)
               .data([(h/2-radar_arcs[radar_arcs.length-1].r),h-(h/2-radar_arcs[radar_arcs.length-1].r)])
               .lineWidth(1)
               .left(w/2)
               .bottom(function(d) {return d;})
               .strokeStyle("#bbb");

       //quadrant lines -- horizontal
       radar.add(pv.Line)
               .data([(w/2-radar_arcs[radar_arcs.length-1].r),w-(w/2-radar_arcs[radar_arcs.length-1].r)])
               .lineWidth(1)
               .bottom(h/2)
               .left(function(d) {return d;})
               .strokeStyle("#bbb");

       //Quadrant Legends
       var radar_quadrant_ctr=1;
       var quadrantFontSize = 18;
       var headingFontSize = 14;
       var stageHeadingCount = 0;
       var lastRadius = 0;
       var lastQuadrant='';
       var spacer = 6;
       var fontSize = 10;
       var total_index = 1;

       //TODO: Super fragile: re-order the items, by radius, in order to logically group by the rings.
       for (var i = 0; i < radar_data.length; i++) {
           //adjust top by the number of headings.
           if (lastQuadrant != radar_data[i].quadrant) {
               radar.add(pv.Label)
                   .left( radar_data[i].left )
                   .top( radar_data[i].top )
                   .text(  radar_data[i].quadrant)
                   .strokeStyle( radar_data[i].color )
                   .fillStyle( radar_data[i].color )
                   .font(quadrantFontSize + "px sans-serif");

               lastQuadrant = radar_data[i].quadrant;

           }

           // group items by stage based on how far they are from each arc
           var itemsByStage = _.groupBy(radar_data[i].items, function(item) {
             for(var arc_i = 0; arc_i < radar_arcs.length; arc_i++) {
               if (item.pc.r < radar_arcs[arc_i].r)
               {
                 return arc_i;
               }
             }
             return 0;
           });

           var offsetIndex = -1;

           for(var stageIdx = 0; stageIdx < radar_arcs.length; stageIdx++) {
               offsetIndex++;

               if(stageIdx > 0) {
                   if (itemsByStage[stageIdx - 1] !== null && itemsByStage[stageIdx - 1] !== undefined) {
                       if (itemsByStage[stageIdx - 1].length !== null && itemsByStage[stageIdx - 1].length !== undefined) {
                           offsetIndex += itemsByStage[stageIdx - 1].length;
                       }
                   }
               }

               radar.add(pv.Label)
                   .left( radar_data[i].left + headingFontSize )
                   .top( radar_data[i].top + quadrantFontSize + spacer + (stageIdx * headingFontSize) + (offsetIndex * fontSize) )
                   .text( radar_arcs[stageIdx].name)
                   .strokeStyle( '#cccccc' )
                   .fillStyle( '#cccccc')
                   .font(headingFontSize + "px Courier New");

               radar.add(pv.Label)
                   .left( radar_data[i].left )
                   .top( radar_data[i].top + quadrantFontSize + spacer + (stageIdx * headingFontSize) + (offsetIndex * fontSize) )
                   .strokeStyle( radar_data[i].color )
                   .fillStyle( radar_data[i].color )
                   .add( pv.Dot )
                       .def("i", radar_data[i].top + quadrantFontSize + spacer + (stageIdx * headingFontSize) + spacer  + (offsetIndex * fontSize) )
                       .data(itemsByStage[stageIdx])
                       .top( function() { return ( this.i() + (this.index * fontSize) );} )
                       .shape( function(d) {return (d.movement === 't' ? "triangle" : "circle");})
                       .cursor( function(d) {
       //                    console.log("Item-" + d.name + '::R-' +  d.pc.r + '::t' + d.pc.t);
                           return ( d.url !== undefined ? "pointer" : "auto" );
                       })
       //                .event("click", function(d) { if ( d.url !== undefined ){self.location =  d.url}})
                       .event("click", function(d) { handleClickRadarItem(d.assessmentItem);})
                       .size(fontSize)
                       .angle(45)
                       .anchor("right")
                           .add(pv.Label)
                           .text(function(d) {return radar_quadrant_ctr++ + ". " + d.name;} );


                   radar.add(pv.Dot)
                     .def("active", false)
                     .data(itemsByStage[stageIdx])
                     .size( function(d) { return ( d.blipSize !== undefined ? d.blipSize : 70 ); })
                     .left(function(d) { var x = polar_to_raster(d.pc.r, d.pc.t, w, h)[0];
       //                                  console.log("name:" + d.name + ", x:" + x);
                                         return x;})
                     .bottom(function(d) { var y = polar_to_raster(d.pc.r, d.pc.t, w, h)[1];
       //                                    console.log("name:" + d.name + ", y:" + y);
                                           return y;})
                     .title(function(d) { return d.name + '\n' + d.assessmentItem.details;})
                     .cursor( function(d) { return ( d.url !== undefined ? "pointer" : "auto" ); })
       //              .event("click", function(d) { if ( d.url !== undefined ){self.location =  d.url}})
                       .event("click", function(d) { handleClickRadarItem(d.assessmentItem);})
                     .angle(Math.PI)  // 180 degrees in radians !
                     .strokeStyle(radar_data[i].color)
                     .fillStyle(radar_data[i].color)
                     .shape(function(d) {return (d.movement === 't' ? "triangle" : "circle");})
                     .anchor("center")
                         .add(pv.Label)
                         .text(function(d) {return total_index++;})
                         .textBaseline("middle")
                         .textStyle("white");
            }
        }

        radar.anchor('radar');
        radar.render();
     };

     const updateRadar = (sourceRadar) => {
        if(isValid(sourceRadar) && isValid(sourceRadar.id)){
            let radarRepository = new RadarRepository();
            if(sourceRadar.id > 0){
                radarRepository.getByUserIdAndRadarId(isPublic, userId, sourceRadar.id, handleGetRadarResponse);
             } else {
                let completeRadarManager = new CompleteRadarManager();

                if(completeRadarManager.isRadarTheCompleteView(sourceRadar.id, sourceRadar.name)){
                    radarRepository.getFullView(isPublic, userId, sourceRadar.radarTemplate.id, handleGetRadarResponse);
                }
             }
         }
    }

    const handleGetRadarResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            renderRadar(data);
        }
    }

    const renderRadar = (sourceRadar) => {
         if(isValid(sourceRadar)){
            initializeRadar(sourceRadar.height,
                            sourceRadar.width,
                            sourceRadar.quadrants,
                            getRadarArcs(sourceRadar),
                            handleClickRadarItem);
         }
     }

     return(
        <div>
            <div id="radar"></div>
            { updateRadar(currentRadar) }
        </div>
     );
}

export default RadarViewControl;