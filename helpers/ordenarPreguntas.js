const compararPorId = (a, b, value) => {
    const indexA = value.indexOf(a.id);
    const indexB = value.indexOf(b.id);
    
    if (indexA === -1 || indexB === -1) {
        // Manejar IDs que no están en el array de IDs
        return 0;
    }
    
    return indexA - indexB;
}

module.exports = {
    compararPorId
}