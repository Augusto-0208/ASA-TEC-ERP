
document.addEventListener('DOMContentLoaded', () => {

    const db = getDatabase();

    if (!db.pedidos) {
        db.pedidos = [];
    }

    const columns = {
        orcamento: document.getElementById('orcamento'),
        desenvolvimento: document.getElementById('desenvolvimento'),
        producao: document.getElementById('producao'),
        pronto: document.getElementById('pronto'),
        entregue: document.getElementById('entregue'),
        receber: document.getElementById('receber')
    };

    function normalizarStatus(status){

        if(!status) return 'orcamento';

        status = status
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, '')
            .trim();

        if(status.includes('orc')) return 'orcamento';
        if(status.includes('desenv')) return 'desenvolvimento';
        if(status.includes('prod')) return 'producao';
        if(status.includes('pronto')) return 'pronto';
        if(status.includes('entreg')) return 'entregue';
        if(status.includes('receb')) return 'receber';

        return 'orcamento';
    }

    Object.values(columns).forEach(col => col.innerHTML = '');

    const pedidos = db.pedidos.filter(
        p => p.tipo !== 'consignado'
    );

    pedidos.forEach(pedido => {

        const status = normalizarStatus(pedido.status);

        const card = document.createElement('div');

        card.className = `card ${status}`;

        card.innerHTML = `
            <strong>${pedido.cliente || 'Cliente'}</strong>
            <p>${pedido.produto || 'Produto'}</p>
            <p>R$ ${pedido.valor || '0,00'}</p>
        `;

        if(columns[status]){
            columns[status].appendChild(card);
        }

    });

});
