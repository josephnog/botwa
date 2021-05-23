FROM fusuf/whatsasena:latest

RUN git clone https://github.com/josephnog/botwa /root/botwa
WORKDIR /root/botwa/
ENV TZ=Europe/Istanbul
RUN npm install supervisor -g
RUN yarn install --no-audit


CMD ["node", "bot.js"]
