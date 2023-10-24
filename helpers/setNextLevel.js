const newLevel = ( points, currentLevel ) => {

    if ( currentLevel === 'Avanzado' ) return { point: points, level: currentLevel, notify: false }

    if ( currentLevel === 'Tierno' && points >= 100 ) {
        return { level: 'Medio', point: 0, notify: true }
    }

    if ( currentLevel === 'Medio' && points >= 200 ) {
        return { level: 'Avanzado', point: 0, notify: true }
    }

    return { point: points + 1, level: currentLevel, notify: false }
}

module.exports = {
    newLevel
}